import 'package:easypay_mobile/theme/colors.dart';
import 'package:easypay_mobile/theme/custom_widget_designs.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/item_model.dart';
import '../../providers/shopping_cart_provider.dart';

class CartPage extends StatelessWidget {
  const CartPage({super.key});

  @override
  Widget build(BuildContext context) {
    List<Item> products = context.watch<ShoppingCart>().cart;
    return Scaffold(
      appBar: AppBar(
        title: const Text("My Items"),
        backgroundColor: AppColors.upLightGrey,
        foregroundColor: Colors.black,
      ),
      backgroundColor: AppColors.upLightGrey,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            getItems(context, products),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 30, vertical: 40),
              child: Column(
                children: [
                  computeCost(),
                  ElevatedButton(
                      style: CustomWidgetDesigns.customSubmitButton(),
                      onPressed: () {
                        if (products.isNotEmpty) {
                          Navigator.pushNamed(context, "/checkout");
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                            content: Text("Cart Empty!"),
                            duration: Duration(milliseconds: 1000),
                            behavior: SnackBarBehavior.floating,
                          ));
                        }
                      },
                      child: const Text("Review Payment Request")),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget getItems(BuildContext context, List<Item> products) {
    String productname = "";
    return products.isEmpty
        ? Container(
            margin: const EdgeInsets.only(top: 100),
            child: const Text(
              'No Items yet!',
              style: TextStyle(fontSize: 15),
            ),
          )
        : Expanded(
            child: Column(
            children: [
              Flexible(
                  child: ListView.builder(
                itemCount: products.length,
                itemBuilder: (BuildContext context, int index) {
                  return ListTile(
                    title: Text(products[index].name),
                    subtitle: Text("PHP ${products[index].amount}"),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete_outline),
                      onPressed: () {
                        productname = products[index].name;

                        if (products.isNotEmpty) {
                          context.read<ShoppingCart>().removeItem(productname);
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                            content: Text("$productname removed!"),
                            duration: const Duration(milliseconds: 1000),
                          ));
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                            content: Text("Cart Empty!"),
                            duration: Duration(milliseconds: 1000),
                          ));
                        }
                      },
                    ),
                  );
                },
              )),
            ],
          ));
  }

// cart = nirereturn ng provider class
  Widget computeCost() {
    return Consumer<ShoppingCart>(builder: (context, cart, child) {
      return SizedBox(
          height: 100,
          width: double.infinity,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Divider(
                color: Colors.grey,
                thickness: 1,
              ),
              Container(
                margin: const EdgeInsets.symmetric(vertical: 10),
                child: Text(
                  "Total: PHP ${cart.cartTotal}",
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ));
    });
  }
}
