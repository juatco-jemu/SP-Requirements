import 'package:easypay_mobile/api/firebase_transactions.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../models/transaction_model.dart';

class TransactionProvider with ChangeNotifier {
  FirebaseTransactions fbTransaction = FirebaseTransactions();

  late Stream<List<UserTransaction>> _userTransactions;
  Stream<List<UserTransaction>> get userTransactions => _userTransactions;
  final yearMonthDate = DateFormat('yyyy-MM-dd').format(DateTime.now()).toString();

  // Add a variable to store the queue number
  String? _queueNumber;
  String? get queueNumber => _queueNumber;

  void startListeningToTransactions(String userId) {
    _userTransactions = FirebaseTransactions.listenToUserTransactions(userId).map((snapshot) {
      return snapshot.docs.map((doc) => UserTransaction.fromMap(doc.data())).toList();
    });
  }

  // Modify addUserTransaction to set queue number
  void addUserTransaction(BuildContext context, UserTransaction item, String ticketNumber) async {
    try {
      // Add the transaction to the queue and get the transactionId
      await fbTransaction.addToQueue(context, item.toMap(), yearMonthDate, ticketNumber);

      notifyListeners();
    } catch (e) {
      print('Error adding transaction or fetching queue number: $e');
      // Optionally, you can set an error state to notify the UI
    }
  }
}
