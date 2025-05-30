import 'package:easypay_mobile/components/noOverflowScaffold.dart';
import 'package:easypay_mobile/pages/authentication/signup.dart';
import 'package:easypay_mobile/theme/colors.dart';
import 'package:easypay_mobile/theme/custom_widget_designs.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../(logged-in)/home/home.dart';
import '../../providers/auth_provider.dart';

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  State<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  final _formKey = GlobalKey<FormState>();
  String? email;
  String? password;
  bool showSignInErrorMessage = false;
  bool _obscureText = true; // added this to hide password

  late Size screen = MediaQuery.of(context).size;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
            width: screen.width,
            height: screen.height,
            color: AppColors.upLightGrey,
            // decoration: CustomWidgetDesigns.gradientBackground(),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  spacer,
                  spacer,
                  _buildHeader(),
                  _buildForm(),
                ])),
      ),
    );
  }

  // @override
  // Widget build(BuildContext context) {
  //   return NoOverflowScaffold(header: _buildHeader(), body: _buildForm());
  // }

  Widget _buildForm() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 30),
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            emailField,
            passwordField,
            showSignInErrorMessage ? signInErrorMessage : Container(),
            submitButton,
            orDivider,
            googleSignUpButton,
            signUpButton
          ],
        ),
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
                "Sign In",
                style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      ],
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
                // added IconButton to show/hide password
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
                return "Please enter your password";
              }
              return null;
            },
          ),
        ),
      );

  Widget get signInErrorMessage => const Padding(
        padding: EdgeInsets.only(bottom: 30),
        child: Text(
          "Invalid email or password",
          style: TextStyle(color: Colors.red),
        ),
      );

  Widget get submitButton => ElevatedButton(
      style: CustomWidgetDesigns.customSubmitButton(),
      onPressed: () async {
        if (_formKey.currentState!.validate()) {
          _formKey.currentState!.save();
          final user = await context.read<UserAuthProvider>().signIn(email!, password!);
          if (user != null && mounted) {
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => const Homepage()),
              (Route<dynamic> route) => false,
            );
          } else {
            setState(() {
              showSignInErrorMessage = true;
            });
          }
        }
      },
      child: const Text("Sign In"));

  Widget get signUpButton => Padding(
        padding: const EdgeInsets.all(30),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("No account yet?"),
            TextButton(
                style: TextButton.styleFrom(foregroundColor: AppColors.upGreen),
                onPressed: () {
                  Navigator.push(
                      context, MaterialPageRoute(builder: (context) => const SignupPage()));
                },
                child: const Text("Sign Up"))
          ],
        ),
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
        final user = await context.read<UserAuthProvider>().signInWithGoogle();
        // check if the widget hasn't been disposed of after an asynchronous action
        if (user != null && mounted) {
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (context) => const Homepage()), // Navigate to the home page
            (Route<dynamic> route) => false, // Remove all previous routes
          );
        }
      },
      child: const Text("Sign In with Google"));
  Widget get spacer => const SizedBox(height: 60);
}
