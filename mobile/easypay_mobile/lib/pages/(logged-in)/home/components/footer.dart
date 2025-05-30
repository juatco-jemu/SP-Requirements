import 'package:flutter/material.dart';

class AppFooter extends StatelessWidget {
  const AppFooter({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          _buildInformation(),
        ],
      ),
    );
  }
}

Widget spacer(double height) {
  return SizedBox(height: height);
}

Widget _buildInformation() {
  return Column(children: [
    const Text("About Us", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
    spacer(10),
    const Text(
        textAlign: TextAlign.center,
        "The Cashier’s Office is responsible for all collections remitted and received by this office as well as the disbursements of all approved UIS and received vouchers and placement of investments."),
    spacer(15),
  ]);
}
