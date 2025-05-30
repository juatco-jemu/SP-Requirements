import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:easypay_mobile/theme/colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/transaction_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/transaction_provider.dart';

class TransactionsPage extends StatefulWidget {
  const TransactionsPage({super.key});

  @override
  State<TransactionsPage> createState() => _TransactionsPageState();
}

class _TransactionsPageState extends State<TransactionsPage> {
  @override
  void initState() {
    super.initState();
    final authProvider = Provider.of<UserAuthProvider>(context, listen: false);
    final transactionProvider = Provider.of<TransactionProvider>(context, listen: false);
    transactionProvider.startListeningToTransactions(authProvider.user!.uid);
  }

  @override
  Widget build(BuildContext context) {
    final transactionsList = context.watch<TransactionProvider>().userTransactions;
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.upLightGrey,
        foregroundColor: Colors.black,
        title: const Text("Transactions"),
      ),
      body: StreamBuilder<List<UserTransaction>>(
        stream: transactionsList,
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(
              child: Text("An error occurred ${snapshot.error}"),
            );
          } else if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Text("No transactions yet"),
            );
          }

          List<UserTransaction> transactions = snapshot.data!;

          return Container(
            padding: const EdgeInsets.all(20),
            color: AppColors.upLightGrey,
            child: ListView.builder(
              itemCount: transactions.length,
              itemBuilder: (context, index) {
                final transaction = transactions[index];
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${transaction.date}',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    ...transaction.collections.map<Widget>((collection) {
                      return ListTile(
                        title: Text(collection.name),
                        subtitle: Text(transaction.status.toString(),
                            style: TextStyle(
                                color: transaction.status == "Cancelled" ||
                                        transaction.status == "Appointment Expired"
                                    ? Colors.red
                                    : transaction.status == "Completed"
                                        ? AppColors.upGreen
                                        : Colors.yellow)),
                        trailing: Text("PHP ${collection.amount}",
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      );
                    }),
                    const Divider(),
                  ],
                );
              },
            ),
          );
        },
      ),
    );
  }
}
