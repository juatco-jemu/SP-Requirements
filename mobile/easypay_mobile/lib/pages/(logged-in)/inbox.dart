import 'package:easypay_mobile/components/subheader.dart';
import 'package:easypay_mobile/theme/colors.dart';
import 'package:flutter/material.dart';

class InboxPage extends StatefulWidget {
  const InboxPage({super.key});

  @override
  State<InboxPage> createState() => _InboxPageState();
}

class _InboxPageState extends State<InboxPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.upGreen,
        foregroundColor: Colors.white,
        title: const Text("Inbox"),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SubHeader(title: "Latest"),
            _buildTiles(),
          ],
        ),
      ),
    );
  }
}

//dummy tiles
Widget _buildTiles() {
  return Column(
    children: [
      ListTile(
        leading: const Icon(Icons.message),
        title: const Text("Message 1"),
        subtitle: const Text("This is a message"),
        onTap: () {},
      ),
      ListTile(
        leading: const Icon(Icons.message),
        title: const Text("Message 2"),
        subtitle: const Text("This is a message"),
        onTap: () {},
      ),
      ListTile(
        leading: const Icon(Icons.message),
        title: const Text("Message 3"),
        subtitle: const Text("This is a message"),
        onTap: () {},
      ),
    ],
  );
}
