import { formatMoney } from "./formatting.tsx";

export const mapFlatter = (object) => {
  const flattenedData = object.flatMap((transactionsData) =>
    transactionsData.collections
      .map((collection, index) => {
        // let clientDetails = transactionsData.userDetails;
        return {
          id: transactionsData.id,
          createdAtDate: index === 0 ? transactionsData.createdAt.toLocaleDateString() : "",
          createdAt: index === 0 ? transactionsData.createdAt.toLocaleString() : "",
          updatedAt: transactionsData.updatedAt.toLocaleString() || "",
          refNumber: transactionsData.refNumber || "-",
          objectCode: collection.objectCode || "-",
          natureOfCollection: collection.name,
          clientName: index === 0 ? transactionsData.clientDetails?.name || "-" : "",
          college: transactionsData.clientDetails?.studentInfo?.college || "-",
          mfoPap: collection.mfoPap || "-",
          amount: formatMoney(collection.amount),
          paymentMethod: transactionsData.paymentMethod || "-",
          GLCode: collection.GLCode || "-",
          GLCodeDescription: collection.objectDescription || "-",
          accountCode: collection.accountCode || "-",
          responsibilityCode: collection.responsibilityCode || "-",
          localeDateShort: transactionsData.createdAt.toLocaleString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        };
      })
      .filter((transaction) => transaction !== null)
  );
  return flattenedData;
};
