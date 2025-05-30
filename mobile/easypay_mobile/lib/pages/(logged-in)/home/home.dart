import 'package:easypay_mobile/pages/(logged-in)/home/components/appBar.dart';
import 'package:easypay_mobile/pages/(logged-in)/home/components/footer.dart';
import 'package:easypay_mobile/pages/(logged-in)/home/components/transactions.dart';
import 'package:easypay_mobile/pages/(logged-in)/home/components/queue.dart';
import 'package:easypay_mobile/theme/colors.dart';
import 'package:flutter/material.dart';

import '../../../theme/custom_widget_designs.dart';
import '../make_order.dart';

class Homepage extends StatefulWidget {
  const Homepage({super.key});

  @override
  State<Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  void handleMakePayment() {
    Navigator.push(context, MaterialPageRoute(builder: (context) => const OrderPage()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.upLightGrey,
      appBar: const AppBarComponent(),
      body: const Column(
        children: [
          Expanded(
              child: SingleChildScrollView(
            child: Column(
              children: [
                QueueWidget(),
                TransactionsComponent(),
                AppFooter(),
              ],
            ),
          ))
        ],
      ),
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 40),
            child: Container(
              color: Colors.white,
              width: double.infinity,
              child: ElevatedButton(
                  onPressed: handleMakePayment,
                  style: CustomWidgetDesigns.customSubmitButton().copyWith(
                    shape: WidgetStateProperty.all<RoundedRectangleBorder>(
                      RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(50),
                      ),
                    ),
                  ),
                  child: const Text(
                    "Make Payment",
                    style: TextStyle(fontSize: 16),
                  )),
            ),
          ),
          // botNavBar,
        ],
      ),
    );
  }
}
