import 'package:easypay_mobile/api/default_duration_api.dart';
import 'package:flutter/material.dart';

class DefaultDurationProvider extends ChangeNotifier {
  Duration _defaultDuration = Duration.zero; // Initialize with a default value

  Duration get defaultDuration => _defaultDuration;

  DefaultDurationProvider() {
    fetchDefaultDuration();
  }

  Future<void> fetchDefaultDuration() async {
    try {
      Duration duration = await DefaultDurationApi.fetchDefaultDuration();
      print('Fetched default duration: $duration');
      _defaultDuration = duration;
      notifyListeners(); // Notify listeners of the change
    } catch (error) {
      // Handle errors appropriately
      print('Error fetching default duration: $error');
    }
  }
}
