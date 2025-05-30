import 'package:flutter/material.dart';
import 'colors.dart';

class CustomWidgetDesigns {
  static BoxDecoration customContainer() {
    return BoxDecoration(
      color: AppColors.upLightGrey,
      borderRadius: BorderRadius.circular(12),
    );
  }

  static BoxDecoration boxShadow() {
    return BoxDecoration(boxShadow: [
      BoxShadow(
        color: AppColors.upGreen.withOpacity(0.2),
        spreadRadius: 1,
        blurRadius: 2,
        offset: const Offset(0, 3),
      )
    ]);
  }

  static InputDecoration customFormField(label, hint) {
    return InputDecoration(
      fillColor: Colors.white, // Change the background color to white
      filled: true, // Enable fillColor
      border: OutlineInputBorder(
        borderSide: const BorderSide(color: Colors.grey, width: 1 // Set border color
            ),
        borderRadius: BorderRadius.circular(15), // Add rounded corners
      ),
      label: Text(label, style: const TextStyle(color: Colors.black)),
      hintText: hint,
      // Add a shadow
    );
  }

  static ButtonStyle customSubmitButton() {
    return const ButtonStyle(
      backgroundColor: WidgetStatePropertyAll(AppColors.upGreen),
      foregroundColor: WidgetStatePropertyAll(Colors.white),
      padding: WidgetStatePropertyAll(EdgeInsets.symmetric(horizontal: 40.0)),
      minimumSize: WidgetStatePropertyAll(Size(400, 50)),
      shape: WidgetStatePropertyAll(
          RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(15)))),
    );
  }

  static BoxDecoration customTileContainer() {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
    );
  }
}
