import 'package:easypay_mobile/components/subheader.dart';
import 'package:easypay_mobile/pages/(logged-in)/shopping_cart.dart';
import 'package:easypay_mobile/theme/colors.dart';
import 'package:easypay_mobile/theme/custom_widget_designs.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/item_model.dart';
import '../../providers/shopping_cart_provider.dart';

class OrderPage extends StatefulWidget {
  const OrderPage({super.key});

  @override
  State<OrderPage> createState() => _OrderPageState();
}

class _OrderPageState extends State<OrderPage> {
  String dropdownValue = "";
  TextEditingController amountController = TextEditingController();
  final dropdownItems = [
    "Choose Transaction Type",
    "CTC-Form 5",
    "Student I.D.",
    "Certifications",
    "Application Fee",
    "Transcript of Records (TOR)",
    "LOA Fee",
    "Removal Fee",
    "UPHRS Fee",
    "Dropping Fee",
    "True Copy of Grades (TCG)",
    "AWOL Fee",
    "Bond Fee (BAO)",
    "Verification Fee",
    "Admission Fee",
    "Deferment Fee",
    "Billing (Utilities)",
    "BAC Registration Fee",
  ];
  @override
  void initState() {
    super.initState();
    dropdownValue = dropdownItems[0];
  }

  @override
  void dispose() {
    amountController.dispose();
    super.dispose();
  }

  void resetForm() {
    dropdownValue = dropdownItems[0];
    amountController.clear();
    FocusScope.of(context).unfocus();
  }

  @override
  Widget build(BuildContext context) {
    Size screen = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.upLightGrey,
        foregroundColor: Colors.black,
      ),
      resizeToAvoidBottomInset: true,
      backgroundColor: AppColors.upLightGrey,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisSize: MainAxisSize.max,
            children: [
              Column(
                children: [
                  const Row(
                    children: [
                      Text(
                        "Make Payment",
                        style: const TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  spacer(25),
                  const SubHeader(title: "Transaction Type"),
                  _buildDropdown(context, dropdownItems, (String? newValue) {
                    setState(() {
                      dropdownValue = newValue!;
                    });
                  }, dropdownValue),
                  spacer(30),
                  const SubHeader(title: "Amount:"),
                  spacer(10),
                  _buildAmounTextField(context, amountController),
                  spacer(50),
                ],
              ),
              Column(
                children: [
                  const Text(
                    "Make sure to double-check the amount before proceeding.",
                    textAlign: TextAlign.center,
                  ),
                  spacer(20),
                  _buildSendOrderButton(context, dropdownValue, amountController, resetForm),
                  spacer(20),
                  goToCartTextButton(context)
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

Widget goToCartTextButton(BuildContext context) {
  return TextButton(
    onPressed: () => navigateToCart(context),
    child: const Text(
      "Go to Cart",
      style: TextStyle(color: AppColors.upGreen, fontSize: 16),
    ),
  );
}

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

Widget _buildDropdown(BuildContext context, List<String> dropdownItems,
    ValueChanged<String?> onChanged, dropdownValue) {
  return Container(
    padding: const EdgeInsets.symmetric(horizontal: 10),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(15),
      border: Border.all(color: Colors.grey, width: 1.5),
    ),
    child: DropdownButton<String>(
      items: dropdownItems.map((String value) {
        return DropdownMenuItem<String>(
          value: value,
          child: Text(value),
        );
      }).toList(),
      onChanged: onChanged,
      value: dropdownValue,
      dropdownColor: Colors.white,
      icon: const Icon(Icons.arrow_drop_down, color: Colors.black),
      underline: Container(),
      isExpanded: true,
    ),
  );
}

Widget _buildAmounTextField(BuildContext context, TextEditingController amountController) {
  return TextField(
    controller: amountController,
    keyboardType: TextInputType.number,
    decoration: CustomWidgetDesigns.customFormField("Amount", "Enter amount").copyWith(
      suffixIcon: IconButton(
        onPressed: () => amountController.clear(),
        icon: const Icon(Icons.clear),
      ),
    ),
  );
}

Widget _buildSendOrderButton(BuildContext context, String dropdownValue,
    TextEditingController amountController, VoidCallback resetForm) {
  return ElevatedButton(
    style: CustomWidgetDesigns.customSubmitButton(),
    onPressed: () {
      final amountText = amountController.text;
      if (amountText.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text("Amount cannot be empty!"),
          behavior: SnackBarBehavior.floating,
          duration: Duration(milliseconds: 1000),
        ));
        return;
      }
      final amount = double.tryParse(amountText);
      print("Sending Order: $dropdownValue, Amount: $amount");
      context.read<ShoppingCart>().addItem(Item(name: dropdownValue, amount: amount!));
      //reset the form
      resetForm();
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text("Successfully added to Payment list!"),
        behavior: SnackBarBehavior.floating,
        duration: Duration(milliseconds: 2000),
      ));
      return;
    },
    child: const Text("Add to Payment list"),
  );
}

// Remove the incorrect extension method

Widget spacer(double size) {
  return SizedBox(
    height: size,
  );
}
