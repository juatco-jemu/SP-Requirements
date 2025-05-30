import 'package:easypay_mobile/theme/colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../../providers/transaction_provider.dart';

class QueueWidget extends StatefulWidget {
  const QueueWidget({super.key});

  @override
  State<QueueWidget> createState() => _QueueWidgetState();
}

class _QueueWidgetState extends State<QueueWidget> {
  @override
  Widget build(BuildContext context) {
    final queueNo = context.watch<TransactionProvider>().queueNumber;
    return Container(
        padding: const EdgeInsets.all(30.0),
        margin: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 20.0),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: const Color.fromARGB(149, 132, 132, 132), width: 2),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Center(
          child: Column(
            children: [
              // Text("Current Queue Number",
              //     style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
              // Text("A003", style: const TextStyle(fontSize: 30, fontWeight: FontWeight.bold)),
              // spacer(20),

              Column(
                // crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Image.asset('assets/images/uplb-logo.png', width: 200),
                  spacer(10),
                  const Text(
                    "Cashier Office Hours",
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const Text("Monday to Friday", style: TextStyle(fontSize: 17)),
                  const Text("8:00 AM - 2:00 PM", style: TextStyle(fontSize: 15)),
                ],
              ),
              const Padding(
                padding: const EdgeInsets.only(top: 18.0),
                child: Column(
                  children: [
                    const Text(
                      "Remember to go to the cashier's office during office hours only.",
                      style: const TextStyle(fontSize: 13),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ));
  }
}

Widget spacer(double height) {
  return SizedBox(height: height);
}
