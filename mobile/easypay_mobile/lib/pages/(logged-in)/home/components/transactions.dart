import 'package:easypay_mobile/models/transaction_model.dart';
import 'package:easypay_mobile/providers/auth_provider.dart';
import 'package:easypay_mobile/providers/transaction_provider.dart';
import 'package:easypay_mobile/theme/colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../transactions_page.dart';

class TransactionsComponent extends StatefulWidget {
  const TransactionsComponent({super.key});

  @override
  State<TransactionsComponent> createState() => _TransactionsComponentState();
}

class _TransactionsComponentState extends State<TransactionsComponent> {
  List<Map<String, dynamic>> sampleTransactions = [
    {
      "refNo": "123456",
      "date": "2021 Oct 10",
      "natureOfCollection": "TCG Fee",
      "amount": "P 100.00",
    },
    {
      "refNo": "123457",
      "date": "2021 Oct 11",
      "natureOfCollection": "Certification Fee",
      "amount": "P 50.00",
    },
    {
      "refNo": "123458",
      "date": "2021 Oct 12",
      "natureOfCollection": "Transcript Fee",
      "amount": "P 150.00",
    },
    {
      "refNo": "123459",
      "date": "2021 Oct 13",
      "natureOfCollection": "CTC Fee",
      "amount": "P 200.00",
    },
  ];

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
    return Container(
      padding: const EdgeInsets.all(10.0),
      margin: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 20.0),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Colors.transparent),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          //create subheader widget
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Transactions",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              TextButton(
                  onPressed: () {
                    Navigator.push(
                        context, MaterialPageRoute(builder: (context) => const TransactionsPage()));
                  },
                  child: const Text("See All")),
            ],
          ),
          const SizedBox(height: 10),
          buildTransactionList(context, transactionsList)
        ],
      ),
    );
  }
}

Widget buildTransactionList(BuildContext context, Stream<List<UserTransaction>> transactions) {
  return StreamBuilder<List<UserTransaction>>(
    stream: transactions,
    builder: (context, snapshot) {
      if (snapshot.hasError) {
        return SizedBox(
          height: 250,
          child: Center(
            child: Text("An error occurred ${snapshot.error}"),
          ),
        );
      } else if (snapshot.connectionState == ConnectionState.waiting) {
        return const SizedBox(
          height: 250,
          child: Center(
            child: CircularProgressIndicator(),
          ),
        );
      } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
        return const SizedBox(height: 250, child: Center(child: Text("No transactions yet")));
      }

      List<UserTransaction> transactions = snapshot.data!.take(4).toList();
      print(transactions);

      return Container(
        padding: const EdgeInsets.all(10),
        color: Colors.white,
        child: ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: transactions.length,
          itemBuilder: (context, index) {
            final transaction = transactions[index];
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      transaction.date,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Text(
                      transaction.status == 'Pending' ? '${transaction.ticketNumber}' : '',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
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
  );
}
