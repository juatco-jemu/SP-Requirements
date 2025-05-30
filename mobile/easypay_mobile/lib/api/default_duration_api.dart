import 'package:cloud_firestore/cloud_firestore.dart';

class DefaultDurationApi {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  static Future<Duration> fetchDefaultDuration() async {
    try {
      DocumentSnapshot snapshot =
          await _firestore.collection('settings').doc('DefaultQueueDuration').get();

      if (snapshot.exists) {
        int days = snapshot.get('duration'); // Assuming 'duration' is in days
        // Convert days to milliseconds
        int milliseconds = days * 24 * 60 * 60 * 1000;
        print('Default duration in milliseconds: $milliseconds');
        return Duration(milliseconds: milliseconds);
      } else {
        // Handle the case where the document doesn't exist
        throw Exception('DefaultDuration document not found.');
      }
    } catch (error) {
      // Handle errors appropriately
      rethrow; // Rethrow the error to be handled by the provider
    }
  }
}
