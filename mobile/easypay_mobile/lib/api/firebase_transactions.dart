import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:easypay_mobile/providers/default_duration_provider.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class FirebaseTransactions {
  static final db = FirebaseFirestore.instance;

  Future<Duration> _waitForDefaultDuration(BuildContext context) async {
    final provider = Provider.of<DefaultDurationProvider>(context, listen: false);
    Duration defaultDuration = provider.defaultDuration;

    while (defaultDuration == Duration.zero) {
      await Future.delayed(const Duration(milliseconds: 5000));
      defaultDuration = provider.defaultDuration;
    }

    return defaultDuration;
  }

  Future<void> addToQueue(BuildContext context, Map<String, dynamic> transaction,
      String yearMonthDate, String ticketNumber) async {
    try {
      final defaultDuration = await _waitForDefaultDuration(context);
      print('Default duration in transaction api: $defaultDuration');

      if (defaultDuration == Duration.zero) {
        throw Exception('Default duration is not set');
      }

      final user = FirebaseAuth.instance.currentUser;
      if (user == null) {
        throw Exception('No user is currently signed in');
      }

      // Calculate expiresAt timestamp and set it to 2 PM on the expiration day
      final now = DateTime.now();
      final expirationDate = now.add(defaultDuration);
      final expiresAt =
          DateTime(expirationDate.year, expirationDate.month, expirationDate.day, 14, 0, 0);

      print('Transaction expires at: $expiresAt');

      transaction['createdAt'] = FieldValue.serverTimestamp();
      transaction['expiresAt'] = expiresAt;
      transaction['ticketNumber'] = ticketNumber;
      transaction['userId'] = user.uid;

      // Create a batch
      WriteBatch batch = db.batch();

      // Add the transaction to the transaction collection
      DocumentReference transactionDocRef = db.collection('transactions').doc();
      batch.set(transactionDocRef, transaction);

      // Add the transaction to the queue collection
      DocumentReference queueDocRef =
          db.collection('queues').doc(yearMonthDate).collection('queue').doc();
      DocumentReference queueDateDocRef = db.collection('queues').doc(yearMonthDate);
      batch.set(queueDateDocRef, {'date': yearMonthDate});
      batch.set(queueDocRef, transaction);
      batch.update(queueDocRef, {'transactionId': transactionDocRef.id});

      // Commit the batch
      await batch.commit();

      // Return the generated transactionId (Firestore document ID)
      // This is the transactionId
    } catch (e) {
      print('Error adding transaction to queue: $e');
      rethrow; // Optionally, rethrow the error or return a default value
    }
  }

  Future<void> deleteTransaction(String transactionId) async {
    await db.collection('transactions').doc(transactionId).delete();
  }

  static Stream<QuerySnapshot<Map<String, dynamic>>> listenToUserTransactions(String userId) {
    return db
        .collection('transactions')
        .where('userId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }
}
