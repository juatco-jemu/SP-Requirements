import 'package:easypay_mobile/pages/(logged-in)/notifications.dart';
import 'package:easypay_mobile/pages/(logged-in)/shopping_cart.dart';
import 'package:easypay_mobile/providers/shopping_cart_provider.dart';
import 'package:easypay_mobile/theme/colors.dart';
import 'package:flutter/material.dart';

import '../../profile.dart';

class AppBarComponent extends StatelessWidget implements PreferredSizeWidget {
  const AppBarComponent({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppColors.upLightGrey,
      elevation: 0,
      leading: Container(
        padding: const EdgeInsets.all(10),
        width: 40,
        height: 40,
        child: CircleAvatar(
          backgroundColor: AppColors.upLightGreen,
          radius: 20,
          child: IconButton(
            onPressed: () {
              navigateToProfile(context);
            },
            icon: const Icon(Icons.person_outline, color: AppColors.upGreen, size: 20),
          ),
        ),
      ),
      actions: [
        IconButton(
            onPressed: () {
              navigateToCart(context);
            },
            icon: const Icon(Icons.shopping_cart, color: Colors.black)),
        IconButton(
          onPressed: () {
            navigateToNotifications(context);
          },
          icon: const Icon(Icons.notifications_none, color: Colors.black),
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(60);
}

navigateToProfile(BuildContext context) => Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => const ProfilePage(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(-1.0, 0.0);
          const end = Offset.zero;
          const curve = Curves.ease;

          var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
          var offsetAnimation = animation.drive(tween);

          return SlideTransition(
            position: offsetAnimation,
            child: child,
          );
        },
      ),
    );

navigateToCart(BuildContext context) => Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => const CartPage(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(1.0, 0.0);
          const end = Offset.zero;
          const curve = Curves.ease;

          var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
          var offsetAnimation = animation.drive(tween);

          return SlideTransition(
            position: offsetAnimation,
            child: child,
          );
        },
      ),
    );

navigateToNotifications(BuildContext context) => Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => const NotificationsPage(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(1.0, 0.0);
          const end = Offset.zero;
          const curve = Curves.ease;

          var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
          var offsetAnimation = animation.drive(tween);

          return SlideTransition(
            position: offsetAnimation,
            child: child,
          );
        },
      ),
    );
