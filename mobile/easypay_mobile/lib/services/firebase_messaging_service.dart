//code link: https://github.com/BohdanSamusko/flutter_firebase_messaging/blob/main/lib/services/firebase_messaging_service.dart

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import './local_notif_service.dart';

class FirebaseMessagingService {
  // Private constructor for singleton pattern
  FirebaseMessagingService._internal();

  // Singleton instance
  static final FirebaseMessagingService _instance = FirebaseMessagingService._internal();

  // Factory constructor to provide singleton instance
  factory FirebaseMessagingService.instance() => _instance;

  // Reference to local notifications service for displaying notifications
  LocalNotificationsService? _localNotificationsService;

  /// Initialize Firebase Messaging and sets up all message listeners
  Future<void> init({required LocalNotificationsService localNotificationsService}) async {
    // Init local notifications service
    _localNotificationsService = localNotificationsService;

    // Handle FCM token
    _handlePushNotificationsToken();

    // Request user permission for notifications
    _requestPermission();

    // Register handler for background messages (app terminated)
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    // Listen for messages when the app is in foreground
    FirebaseMessaging.onMessage.listen(_onForegroundMessage);

    // Listen for notification taps when the app is in background but not terminated
    FirebaseMessaging.onMessageOpenedApp.listen(_onMessageOpenedApp);

    // Check for initial message that opened the app from terminated state
    final initialMessage = await FirebaseMessaging.instance.getInitialMessage();
    if (initialMessage != null) {
      _onMessageOpenedApp(initialMessage);
    }
  }

  Future<String?> getFCMToken() async {
    final token = await FirebaseMessaging.instance.getToken();
    print('Fetched FCM token via getToken(): $token');
    return token;
  }

  Future<void> uploadFCMTokenToFirestore({required String userId, required String token}) async {
    final firestore = FirebaseFirestore.instance;

    try {
      final tokenDoc = firestore.collection('users').doc(userId).collection('fcmTokens').doc(token);

      await tokenDoc.set({
        'token': token,
        'createdAt': FieldValue.serverTimestamp(),
        'platform': 'flutter', // Optional: add platform/device info
      });

      print('Uploaded FCM token to Firestore for userId: $userId');
    } catch (e) {
      print('Failed to upload FCM token: $e');
    }
  }

  /// Auto-upload on token refresh
  void listenToTokenRefresh({required String userId}) {
    FirebaseMessaging.instance.onTokenRefresh.listen((newToken) {
      print('FCM token refreshed: $newToken');
      uploadFCMTokenToFirestore(userId: userId, token: newToken);
    });
  }

  /// Retrieves and manages the FCM token for push notifications
  Future<void> _handlePushNotificationsToken() async {
    // Get the FCM token for the device
    final token = await FirebaseMessaging.instance.getToken();
    print('Push notifications token: $token');

    // Listen for token refresh events
    FirebaseMessaging.instance.onTokenRefresh.listen((fcmToken) {
      print('FCM token refreshed: $fcmToken');
      // TODO: optionally send token to your server for targeting this device
    }).onError((error) {
      // Handle errors during token refresh
      print('Error refreshing FCM token: $error');
    });
  }

  /// Requests notification permission from the user
  Future<void> _requestPermission() async {
    // Request permission for alerts, badges, and sounds
    final result = await FirebaseMessaging.instance.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    // Log the user's permission decision
    print('User granted permission: ${result.authorizationStatus}');
  }

  /// Handles messages received while the app is in the foreground
  void _onForegroundMessage(RemoteMessage message) {
    print('Foreground message received: ${message.data.toString()}');
    final notificationData = message.notification;
    if (notificationData != null) {
      // Display a local notification using the service
      _localNotificationsService?.showNotification(
          notificationData.title, notificationData.body, message.data.toString());
    }
  }

  /// Handles notification taps when app is opened from the background or terminated state
  void _onMessageOpenedApp(RemoteMessage message) {
    print('Notification caused the app to open: ${message.data.toString()}');
    // TODO: Add navigation or specific handling based on message data
  }
}

/// Background message handler (must be top-level function or static)
/// Handles messages when the app is fully terminated
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  print('Background message received: ${message.data.toString()}');
}
