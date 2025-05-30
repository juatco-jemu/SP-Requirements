import 'package:easypay_mobile/pages/(logged-in)/accountSetup.dart';
import 'package:easypay_mobile/pages/(logged-in)/home/home.dart';
import 'package:easypay_mobile/pages/authentication/login.dart';
import 'package:easypay_mobile/providers/auth_provider.dart';
import 'package:easypay_mobile/theme/colors.dart';
import 'package:easypay_mobile/theme/custom_widget_designs.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _formKey = GlobalKey<FormState>();
  String? firstName;
  String? lastName;
  String? email;
  String? username;
  List<String> addressList = [];
  String contactNumber = "";
  List<int> donationIDList = [];
  String? password;
  bool _obscureText = true; // added this to hide password

  late Size screen = MediaQuery.of(context).size;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.upLightGrey,
        foregroundColor: Colors.black,
      ),
      backgroundColor: AppColors.upLightGrey,
      body: SingleChildScrollView(
        child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildHeader(),
              _buildForm(),
              spacer,
            ]),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(50),
          child: Column(
            children: [
              Image.asset("assets/images/uplb-logo.png"),
              const SizedBox(height: 15),
              const Text(
                "Sign Up",
                style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildForm() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 30),
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            emailField,
            passwordField,
            submitButton,
            orDivider,
            googleSignUpButton,
            loginButton,
          ],
        ),
      ),
    );
  }

  Widget get emailField => Padding(
        padding: const EdgeInsets.only(bottom: 30),
        child: Material(
          elevation: 2,
          shadowColor: Colors.grey,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          child: TextFormField(
            decoration: CustomWidgetDesigns.customFormField("Email", "Enter your email"),
            onSaved: (value) => setState(() => email = value),
            validator: (value) {
              // added proper email validation
              if (value == null || value.isEmpty) {
                return "Please enter an email";
              } else if (!RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
                  .hasMatch(value)) {
                return "Please enter a valid email format";
              }
              return null;
            },
          ),
        ),
      );

  Widget get passwordField => Padding(
        padding: const EdgeInsets.only(bottom: 30),
        child: Material(
          elevation: 2,
          shadowColor: Colors.grey,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          child: TextFormField(
            decoration:
                CustomWidgetDesigns.customFormField("Password", "Enter your password").copyWith(
              suffixIcon: IconButton(
                icon: Icon(_obscureText ? Icons.visibility : Icons.visibility_off),
                onPressed: () {
                  setState(() {
                    _obscureText = !_obscureText;
                  });
                },
              ),
            ),
            obscureText: _obscureText,
            onSaved: (value) => setState(() => password = value),
            validator: (value) {
              if (value == null || value.isEmpty) {
                // added password validation
                return "Please enter password";
              } else if (!RegExp(r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$')
                  .hasMatch(value)) {
                return "Password must have at least 8 characters\nconsisting of at least:\n1 small letter,\n1 capital letter,\n1 digit, and\n1 special character";
              }
              return null;
            },
          ),
        ),
      );

  Widget get submitButton => ElevatedButton(
      style: CustomWidgetDesigns.customSubmitButton(),
      onPressed: () async {
        if (_formKey.currentState!.validate()) {
          _formKey.currentState!.save();
          final user = await context.read<UserAuthProvider>().signUp(email!, password!);

          if (user != null && mounted) {
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => const AccountSetupPage()),
              (Route<dynamic> route) => false,
            );
          }
        }
      },
      child: const Text("Sign Up"));

  Widget get loginButton => Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text("Already have an account?"),
          TextButton(
              style: TextButton.styleFrom(foregroundColor: AppColors.upGreen),
              onPressed: () {
                Navigator.pushReplacement(
                    context, MaterialPageRoute(builder: (context) => const SignInPage()));
              },
              child: const Text("Login"))
        ],
      );

  Widget get orDivider => const Padding(
        padding: EdgeInsets.symmetric(vertical: 10),
        child: Text(
          "--------------- or ---------------",
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.normal),
        ),
      );

  Widget get googleSignUpButton => ElevatedButton(
      style: CustomWidgetDesigns.customSubmitButton(),
      onPressed: () async {
        final userAuthProvider = context.read<UserAuthProvider>();
        final user = await userAuthProvider.signInWithGoogle();

        final isNewUser = userAuthProvider.isNewUser(user);
        // check if the widget hasn't been disposed of after an asynchronous action
        if (user != null && mounted) {
          if (isNewUser) {
            // if the user is new, navigate to the homepage
            print("NEW USER");
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => const AccountSetupPage()),
              (Route<dynamic> route) => false,
            );
          } else {
            // if the user is not new, navigate to the homepage
            print("OLD USER");
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(
                  builder: (context) => const Homepage()), // Navigate to the home page
              (Route<dynamic> route) => false, // Remove all previous routes
            );
          }
        }
      },
      child: const Text("Sign Up with Google"));

  Widget get spacer => const SizedBox(height: 30);
}
