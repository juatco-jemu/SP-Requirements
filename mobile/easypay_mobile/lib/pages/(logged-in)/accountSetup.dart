import 'package:easypay_mobile/pages/(logged-in)/home/home.dart';
import 'package:easypay_mobile/providers/user_preference_provider.dart';
import 'package:easypay_mobile/theme/custom_widget_designs.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/auth_provider.dart';

class AccountSetupPage extends StatefulWidget {
  const AccountSetupPage({super.key});

  @override
  State<AccountSetupPage> createState() => _AccountSetupPageState();
}

class _AccountSetupPageState extends State<AccountSetupPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _studNoController = TextEditingController();
  String? name;
  String? studNo;
  String? password;
  bool showSignInErrorMessage = false;

  String dropdownValue = "";
  String collegeCode = "";
  Map<String, String> colleges = {
    "Choose your College": "",
    "CAS": "9300523",
    "CAFS": "9300221",
    "CDC": "9303420",
    "CEM": "9300830",
    "CVM": "9318328",
    "CEAT": "9301032",
    "CHE": "9308631",
    "CFNR": "9300422",
    "UPRHS": "9300321",
    "Graduate School": "930025"
  };

  bool isFormValid() {
    return _studNoController.text.isNotEmpty && dropdownValue != colleges.keys.first;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _studNoController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    final user = context.read<UserAuthProvider>().user;

    final userPrefs = context.read<UserPreferenceProvider>();
    userPrefs.loadUserData();

    setState(() {
      _nameController.text = user?.displayName ?? userPrefs.displayName ?? "Guest";
      _studNoController.text = userPrefs.studentNo ?? "";
      dropdownValue = userPrefs.college ?? colleges.keys.first;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: SingleChildScrollView(
          child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            const Text(
              "Account Setup",
              style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
            ),
            spacer(30),
            const Text(
              "Welcome to the UPLB Cashier Queue App! Let's setup your account first.",
              style: TextStyle(
                fontSize: 15,
              ),
              textAlign: TextAlign.center,
            ),
            spacer(30),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Enter your name"),
                spacer(10),
                usernameField(),
                const Text("Enter your student number (Eg. 201212345)"),
                spacer(10),
                studentNoField(),
                showSignInErrorMessage ? signInErrorMessage : Container(),
                const Text("Choose your college"),
                spacer(10),
                _buildDropdown(context, colleges.keys.toList(), (String? newValue) {
                  setState(() {
                    dropdownValue = newValue!;
                    collegeCode = colleges[newValue]!;
                  });
                }, dropdownValue),
              ],
            ),
          ],
        ),
      )),
      bottomNavigationBar: bottomNavigationBar(context),
    );
  }

  Widget usernameField() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 30),
      child: Material(
        elevation: 2,
        shadowColor: Colors.grey,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: TextFormField(
          controller: _nameController,
          decoration: CustomWidgetDesigns.customFormField("Name", "Enter your name"),
          onSaved: (value) {
            setState(() => name = value);
          },
          validator: (value) {
            if (value == null || value.isEmpty) {
              return "Please enter your email";
            }
            return null;
          },
        ),
      ),
    );
  }

  Widget studentNoField() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 30),
      child: Material(
        elevation: 2,
        shadowColor: Colors.grey,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: TextFormField(
          controller: _studNoController,
          decoration: CustomWidgetDesigns.customFormField("Student Number", "Eg. 201212345"),
          onSaved: (value) {
            setState(() => studNo = value);
          },
          validator: (value) {
            if (value == null || value.isEmpty) {
              return "Please enter your student number";
            }
            return null;
          },
        ),
      ),
    );
  }

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
        items: dropdownItems.map((String key) {
          return DropdownMenuItem<String>(
            value: key,
            child: Text(key),
          );
        }).toList(),
        onChanged: onChanged,
        value: dropdownValue.isEmpty ? dropdownItems[0] : dropdownValue,
        dropdownColor: Colors.white,
        icon: const Icon(Icons.arrow_drop_down, color: Colors.black),
        underline: Container(),
        isExpanded: true,
      ),
    );
  }

  Widget bottomNavigationBar(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 40),
      width: double.infinity,
      child: ElevatedButton(
          style: CustomWidgetDesigns.customSubmitButton(),
          onPressed: () {
            if (isFormValid()) {
              context.read<UserPreferenceProvider>().saveUserData(
                  displayName: _nameController.text,
                  studentNo: _studNoController.text,
                  college: dropdownValue);
              context.read<UserAuthProvider>().updateUserDetails(
                  displayName: _nameController.text,
                  studentNo: _studNoController.text,
                  college: dropdownValue);
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(
                    builder: (context) => const Homepage()), // Navigate to the HomePage
                (Route<dynamic> route) => false,
              );
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Please enter student number/choose your college"),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            }
          },
          child: const Text("Save and go to Homepage")),
    );
  }
}

Widget get signInErrorMessage => const Padding(
      padding: EdgeInsets.only(bottom: 30),
      child: Text(
        "Invalid email or password",
        style: TextStyle(color: Colors.red),
      ),
    );

Widget spacer(double height) {
  return SizedBox(height: height);
}
