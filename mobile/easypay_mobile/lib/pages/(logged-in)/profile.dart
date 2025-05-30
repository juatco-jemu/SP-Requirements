import 'package:easypay_mobile/pages/(logged-in)/accountSetup.dart';
import 'package:easypay_mobile/pages/(logged-in)/make_order.dart';
import 'package:easypay_mobile/pages/authentication/login.dart';
import 'package:easypay_mobile/theme/colors.dart';
import 'package:easypay_mobile/theme/custom_widget_designs.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/auth_provider.dart';
import '../../providers/user_preference_provider.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  dynamic user;
  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final userPrefs = context.read<UserPreferenceProvider>();
    await userPrefs.loadUserData();
    setState(() {
      user = userPrefs;
    });
  }

  @override
  Widget build(BuildContext context) {
    final userPref = context.watch<UserPreferenceProvider>();
    Size screen = MediaQuery.of(context).size;
    final user = context.watch<UserAuthProvider>().user;
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.upLightGrey,
        foregroundColor: Colors.black,
      ),
      body: SingleChildScrollView(
        child: Container(
          color: AppColors.upLightGrey,
          height: screen.height,
          width: screen.width,
          child: Column(
            children: [
              const CircleAvatar(
                radius: 35,
                child: (Icon(Icons.person, size: 50)),
              ),
              spacer(15),
              Text(
                user?.displayName ?? userPref.displayName!,
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              Text(user?.email ?? ""),
              spacer(10),
              _buildProfileMenu(context),
            ],
          ),
        ),
      ),
    );
  }
}

Widget _buildProfileMenu(BuildContext context) {
  return Container(
    margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
    padding: const EdgeInsets.all(20),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: const Color.fromARGB(255, 208, 208, 208)),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("PROFILE MENU",
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: Colors.grey[500])),
        ListTile(
          leading: const Icon(Icons.person_outline),
          title: const Text("Edit Profile"),
          trailing: const Icon(Icons.arrow_forward_ios),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const AccountSetupPage()),
            );
          },
        ),
        ListTile(
          leading: const Icon(Icons.settings_outlined),
          title: const Text("Settings"),
          trailing: const Icon(Icons.arrow_forward_ios),
          onTap: () {},
        ),
        ListTile(
          leading: const Icon(Icons.help_outline),
          title: const Text("Get Help"),
          trailing: const Icon(Icons.arrow_forward_ios),
          onTap: () {},
        ),
        logoutButton(context)
      ],
    ),
  );
}

Widget logoutButton(BuildContext context) => ElevatedButton(
      style: CustomWidgetDesigns.customSubmitButton().copyWith(
        backgroundColor: WidgetStatePropertyAll(Colors.grey[200]),
        foregroundColor: const WidgetStatePropertyAll(Colors.black),
      ),
      onPressed: () async {
        final navigator = Navigator.of(context);
        await context.read<UserAuthProvider>().signOut();
        navigator.pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => const SignInPage()), // Navigate to the login page
          (Route<dynamic> route) => false,
        );
      },
      child: const Text("Logout"),
    );

Widget spacer(double height) => SizedBox(height: height);
