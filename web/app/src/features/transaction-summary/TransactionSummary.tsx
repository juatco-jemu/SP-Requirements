import React, { useEffect, useState } from "react";
import { Calendar1 } from "lucide-react";
import { useTransactions } from "../../context/TransactionContext.tsx";
import { formatMoney, formattedDisplayDateToday } from "../../utils/formatting.tsx";

const dateToday = formattedDisplayDateToday();

export function TransactionSummary() {
  // Use the context to access transactions
  const { transactions } = useTransactions(); // Use the context to get the transactions data
  const [totalCollections, setTotalCollections] = useState(0);
  const [totalAmountCollected, setTotalAmountCollected] = useState(0);
  const [date, setDate] = useState(dateToday);

  useEffect(() => {
    if (transactions.length > 0) {
      setDate(dateToday); // Get the date of the first transaction
      setTotalCollections(transactions.length); // Number of transactions
      setTotalAmountCollected(
        transactions.reduce((acc, transaction) => {
          // Calculate the total amount from all collections
          return (
            acc + transaction.collections.reduce((sum: number, c: { amount: string }) => sum + parseFloat(c.amount), 0)
          );
        }, 0)
      );
    } else {
      setTotalCollections(0);
      setTotalAmountCollected(0);
      setDate(dateToday);
    }
  }, [transactions]);

  return (
    <div>
      <div className="flex justify-between pt-5 px-6">
        <h3 className="text-2xl font-bold">Collection Summary</h3>
      </div>
      <div className="p-5">
        <div className="flex justify-around border bg-gray-100 rounded-3xl text-green-800 p-6">
          <div className="flex items-center gap-4">
            <Calendar1 />
            <div>
              <h3 className="font-bold">Date Today</h3>
              <p>{date}</p>
            </div>
          </div>

          <div className="border-l border-black mx-4"></div>

          <div>
            <h3 className="font-bold">Total No. of Collections</h3>
            <p>{totalCollections}</p>
          </div>

          <div className="border-l border-black mx-4"></div>

          <div>
            <h3 className="font-bold">Total Amount Collected</h3>
            <p>₱ {formatMoney(totalAmountCollected)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
