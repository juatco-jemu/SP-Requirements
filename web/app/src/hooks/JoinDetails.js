export const useJoinDetails = (clients, transactions) => {
  return transactions.map((transaction) => {
    const client = clients.find((client) => client.id === transaction.clientId);
    return {
      ...transaction,
      client,
    };
  });
};
