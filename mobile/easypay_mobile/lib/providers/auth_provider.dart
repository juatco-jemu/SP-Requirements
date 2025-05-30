import 'package:easypay_mobile/api/firebase_auth_api.dart';
import 'package:easypay_mobile/services/firebase_messaging_service.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'package:flutter/material.dart';

class UserAuthProvider with ChangeNotifier {
  late FirebaseAuthApi _authService;
  late Stream<User?> _uStream;
  User? _currentUser;

  UserAuthProvider() {
    _authService = FirebaseAuthApi();
    fetchAuthentication();
  }

  Stream<User?> get userStream => _uStream;
  User? get user => _currentUser;

  void fetchAuthentication() {
    _uStream = _authService.authStateChanges;
    _uStream.listen((User? user) async {
      _currentUser = user;
      notifyListeners();

      if (user != null) {
        await _handleFCMToken(user.uid);
      }
    });
  }

  Future<void> _handleFCMToken(String userId) async {
    final firebaseMessagingService = FirebaseMessagingService.instance();
    final token = await firebaseMessagingService.getFCMToken();

    if (token != null) {
      await firebaseMessagingService.uploadFCMTokenToFirestore(userId: userId, token: token);

      // ✅ Listen for token refresh & auto re-upload
      firebaseMessagingService.listenToTokenRefresh(userId: userId);
    }
  }

  Future<User?> signInWithGoogle() async {
    final User? user = await _authService.signInWithGoogle();
    if (user == null) {
      print("Sign in cancelled by user");
      return null;
    }
    _currentUser = user;
    notifyListeners();
    return user;
  }

  bool isNewUser(User? user) {
    return user?.metadata.creationTime == user?.metadata.lastSignInTime;
  }

  Future<User?> signUp(String email, String password) async {
    final User? user = await _authService.createUserWithEmailAndPassword(email, password);
    if (user == null) {
      print("Sign in cancelled by user");
      return null;
    }
    _currentUser = user;
    notifyListeners();
    return user;
  }

  Future<User?> signIn(String email, String password) async {
    await _authService.signInWithEmailAndPassword(email, password);
    fetchAuthentication();
    return user;
  }

  Future<void> signOut() async {
    await _authService.signOut();
    _currentUser = null;
    notifyListeners();
  }

  Future<void> updateUserDetails({String? displayName, String? studentNo, String? college}) async {
    if (_currentUser != null) {
      await _authService.updateUserDetails(_currentUser!.uid,
          displayName: displayName, studentNo: studentNo, college: college);
      await _currentUser!.reload();
      fetchAuthentication();
      notifyListeners();
    }
    notifyListeners();
  }
}
