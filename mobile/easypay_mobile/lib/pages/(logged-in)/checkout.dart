import 'dart:math';

import 'package:easypay_mobile/pages/(logged-in)/requestCompletePage.dart';
import 'package:easypay_mobile/providers/transaction_provider.dart';
import 'package:easypay_mobile/providers/user_preference_provider.dart';
import 'package:easypay_mobile/theme/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:shortid/shortid.dart';

import '../../models/transaction_model.dart';
import '../../models/item_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/shopping_cart_provider.dart';
import '../../theme/custom_widget_designs.dart';
import 'home/home.dart';

class OrderCheckoutPage extends StatefulWidget {
  const OrderCheckoutPage({super.key});

  @override
  State<OrderCheckoutPage> createState() => _OrderCheckoutPageState();
}

class _OrderCheckoutPageState extends State<OrderCheckoutPage> {
  dynamic user;
  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final userPrefs = context.read<UserPreferenceProvider>();
    await userPrefs.loadUserData();
    setState(() {
      user = userPrefs;
    });
  }

  @override
  Widget build(BuildContext context) {
    final authUser = context.watch<UserAuthProvider>().user;
    List<Item> items = context.watch<ShoppingCart>().cart;
    final refNumber = shortid.generate();

    final date = DateTime.now();
    final formattedDate = DateFormat('MMM dd, yyyy h:mm a').format(date);

    UserTransaction transaction = UserTransaction(
      refNumber: refNumber,
      date: formattedDate,
      collections: items,
      userId: authUser?.uid.toString() ?? "",
      status: "Pending",
    );

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.upLightGrey,
        foregroundColor: Colors.black,
        title: const Text("Review Details"),
      ),
      backgroundColor: AppColors.upLightGrey,
      body: SingleChildScrollView(
        child: Column(
          children: [
            spacer(20),
            Container(
              margin: const EdgeInsets.all(20),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.grey, width: 1),
              ),
              child: Column(
                children: [
                  Text(authUser?.displayName ?? user.displayName ?? "",
                      style: const TextStyle(fontSize: 25, fontWeight: FontWeight.bold)),
                  Text(authUser?.email ?? user.studentNo ?? ""),
                  spacer(20),
                  const Text("Order Summary",
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  spacer(10),
                  const Divider(height: 4, color: Colors.black),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      ...items.map((item) => ListTile(
                            title: Text(item.name),
                            trailing:
                                Text("PHP ${item.amount}", style: const TextStyle(fontSize: 12)),
                          ))
                    ],
                  ),
                  const Divider(height: 4, color: Colors.black),
                  spacer(10),
                  computeCost(),
                  spacer(30),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("Date:"),
                      Text(formattedDate),
                    ],
                  ),
                ],
              ),
            ),
            spacer(20),
            sendOrder(context, transaction, user)
          ],
        ),
      ),
    );
  }

  Widget computeCost() {
    return Consumer<ShoppingCart>(builder: (context, cart, child) {
      return Container(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Total: ",
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              Text(
                "PHP ${cart.cartTotal}",
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ],
          ));
    });
  }
}

Widget sendOrder(BuildContext context, UserTransaction transaction, UserPreferenceProvider user) =>
    Container(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: ElevatedButton(
        style: CustomWidgetDesigns.customSubmitButton().copyWith(
          shape: WidgetStateProperty.all<RoundedRectangleBorder>(
            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(50),
            ),
          ),
        ),
        onPressed: () {
          final randomInt = Random().nextInt(1000) + 1;
          final paddedInt = randomInt.toString().padLeft(4, '0');
          final ticketNumber = "${user.studentNo}-$paddedInt";
          context
              .read<TransactionProvider>()
              .addUserTransaction(context, transaction, ticketNumber);
          context.read<ShoppingCart>().removeAll();
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(
                builder: (context) =>
                    RequestCompletePage(ticketNumber: ticketNumber)), // Navigate to the HomePage
            (Route<dynamic> route) => false,
          );
        },
        child: const Text("Send Payment Request"),
      ),
    );

Widget spacer(double height) {
  return SizedBox(height: height);
}
