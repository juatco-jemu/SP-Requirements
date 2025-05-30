import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserPreferenceProvider with ChangeNotifier {
  bool _isDarkMode = false;
  String? _displayName;
  String? _studentNo;
  String? _college;

  bool get isDarkMode => _isDarkMode;
  String? get displayName => _displayName;
  String? get studentNo => _studentNo;
  String? get college => _college;

  void toggleDarkMode() {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
  }

  Future<void> loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    _displayName = prefs.getString("displayName");
    _studentNo = prefs.getString("studentNo");
    _college = prefs.getString("college");

    notifyListeners();
  }

  Future<void> saveUserData({
    required String displayName,
    required String studentNo,
    required String college,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString("displayName", displayName);
    await prefs.setString("studentNo", studentNo);
    await prefs.setString("college", college);

    _displayName = displayName;
    _studentNo = studentNo;
    _college = college;

    notifyListeners();
  }

  Future<void> saveExpireTime({
    required String expireTime,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString("expireTime", expireTime);
  }

  Future<void> resetUserData() async {
    final prefs = await SharedPreferences.getInstance();

    // Clear the data from SharedPreferences
    await prefs.remove("displayName");
    await prefs.remove("studentNo");
    await prefs.remove("college");

    // Clear the fields in the provider
    _displayName = null;
    _studentNo = null;
    _college = null;

    notifyListeners();
  }
}
