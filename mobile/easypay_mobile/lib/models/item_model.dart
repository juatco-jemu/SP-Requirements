class Item {
  String name;
  double amount;

  Item({
    required this.name,
    required this.amount,
  });

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'amount': amount,
    };
  }

  factory Item.fromMap(Map<String, dynamic> map) {
    return Item(
      name: map['name'],
      amount: map['amount'].toDouble(), // Ensure amount is converted to double
    );
  }
}
