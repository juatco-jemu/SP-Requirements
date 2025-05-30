import 'package:flutter/material.dart';

import '../../../../theme/colors.dart';
import '../../shopping_cart.dart';

class HomePageHeader extends StatefulWidget {
  final String name;
  const HomePageHeader({required this.name, super.key});

  @override
  State<HomePageHeader> createState() => _HomPageHeaderState();
}

class _HomPageHeaderState extends State<HomePageHeader> {
  String get name => widget.name;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.upLightGrey,
      ),
      child: Padding(
        padding: const EdgeInsets.only(left: 30, right: 30, top: kToolbarHeight, bottom: 15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                CircleAvatar(
                  backgroundColor: AppColors.upGreen,
                  radius: 20,
                  child: IconButton(
                      onPressed: () {},
                      icon: const Icon(Icons.person_outline, color: Colors.white, size: 25)),
                ),
                IconButton(
                    onPressed: () {
                      Navigator.push(
                          context, MaterialPageRoute(builder: (context) => const CartPage()));
                    },
                    icon: const Icon(
                      Icons.shopping_cart_checkout,
                      color: Colors.white,
                      size: 35,
                    )),
              ],
            ),
            spacer(10),
          ],
        ),
      ),
    );
  }
}

Widget spacer(double height) {
  return SizedBox(height: height);
}
