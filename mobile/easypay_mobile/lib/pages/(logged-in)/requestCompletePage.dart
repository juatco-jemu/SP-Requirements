import 'package:easypay_mobile/pages/(logged-in)/home/home.dart';
import 'package:easypay_mobile/providers/default_duration_provider.dart';
import 'package:easypay_mobile/theme/colors.dart';
import 'package:easypay_mobile/theme/custom_widget_designs.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class RequestCompletePage extends StatelessWidget {
  final ticketNumber;
  const RequestCompletePage({super.key, required this.ticketNumber});

  @override
  Widget build(BuildContext context) {
    final duration = Provider.of<DefaultDurationProvider>(context).defaultDuration;
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.upLightGrey,
        foregroundColor: Colors.black,
      ),
      backgroundColor: AppColors.upLightGrey,
      body: Container(
        margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 50),
        decoration: const BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(20)),
          border: Border(
              top: BorderSide(width: 1.0, color: Colors.grey),
              bottom: BorderSide(width: 1.0, color: Colors.grey),
              left: BorderSide(width: 1.0, color: Colors.grey),
              right: BorderSide(width: 1.0, color: Colors.grey)),
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          // crossAxisAlignment: CrossAxisAlignment.center,
          // mainAxisAlignment: MainAxisAlignment.center,
          children: [
            spacer(100),
            const Icon(Icons.check_circle, size: 100, color: AppColors.upGreen),
            spacer(10),
            const Text("Request has been sent!",
                style: const TextStyle(fontSize: 25, fontWeight: FontWeight.bold)),
            const Text("Ticket Number:", style: const TextStyle(fontSize: 15)),
            Text(ticketNumber, style: const TextStyle(fontSize: 20)),
            Text("Expiration in: ${duration.inDays} days", style: const TextStyle(fontSize: 20)),
            spacer(20),
            const Text("You have time to process the payment if you can't do it today."),
            spacer(100),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: ElevatedButton(
                  style: CustomWidgetDesigns.customSubmitButton(),
                  onPressed: () {
                    Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(builder: (context) => const Homepage()),
                        (route) => false);
                  },
                  child: const Text("Return to Home")),
            ),
          ],
        ),
      ),
    );
  }
}

Widget spacer(double height) {
  return SizedBox(height: height);
}
