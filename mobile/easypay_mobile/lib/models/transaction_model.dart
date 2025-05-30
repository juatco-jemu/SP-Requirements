import 'package:easypay_mobile/models/item_model.dart';

class UserTransaction {
  final String userId;
  final List<Item> collections;
  final String date;
  final String refNumber;
  String? ticketNumber;
  String? status;

  UserTransaction({
    required this.userId,
    required this.collections,
    required this.date,
    required this.refNumber,
    this.ticketNumber,
    this.status,
  });

  Map<String, dynamic> toMap() {
    return {
      'refNumber': refNumber,
      'userId': userId,
      'collections': collections.map((item) => item.toMap()).toList(),
      'date': date,
      'ticketNumber': ticketNumber,
      'status': status,
    };
  }

  factory UserTransaction.fromMap(Map<String, dynamic> map) {
    return UserTransaction(
      refNumber: map['refNumber'],
      userId: map['userId'],
      collections: List<Item>.from(map['collections']?.map((item) => Item.fromMap(item))),
      date: map['date'],
      ticketNumber: map['ticketNumber'],
      status: map['status'],
    );
  }
}
