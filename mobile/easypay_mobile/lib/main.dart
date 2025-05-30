// import 'package:easypay_mobile/pages/home.dart';
import 'package:easypay_mobile/firebase_options.dart';
import 'package:easypay_mobile/pages/(logged-in)/navigator.dart';
import 'package:easypay_mobile/pages/authentication/login.dart';
import 'package:easypay_mobile/providers/auth_provider.dart';
import 'package:easypay_mobile/providers/default_duration_provider.dart';
import 'package:easypay_mobile/providers/shopping_cart_provider.dart';
import 'package:easypay_mobile/services/firebase_messaging_service.dart';
import 'package:easypay_mobile/services/local_notif_service.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'pages/(logged-in)/checkout.dart';
import 'providers/transaction_provider.dart';
import 'providers/user_preference_provider.dart';
import 'api/firebase_auth_api.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  final localNotificationsService = LocalNotificationsService.instance();
  await localNotificationsService.init();

  final firebaseMessagingService = FirebaseMessagingService.instance();
  await firebaseMessagingService.init(localNotificationsService: localNotificationsService);

  final fcmToken = await firebaseMessagingService.getFCMToken();

  runApp(MultiProvider(providers: [
    ChangeNotifierProvider(create: (context) => UserAuthProvider()),
    ChangeNotifierProvider(create: (context) => ShoppingCart()),
    ChangeNotifierProvider(create: (context) => TransactionProvider()),
    ChangeNotifierProvider(create: (context) => UserPreferenceProvider()),
    ChangeNotifierProvider(create: (context) => DefaultDurationProvider()),
  ], child: const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EasyPay Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color.fromRGBO(0, 86, 63, 1.0)),
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (context) => const ScreenNavigator(),
        '/checkout': (context) => const OrderCheckoutPage(),
        '/login': (context) => const SignInPage(),
      },
    );
  }
}
