export class DummyCollection {
  static dummyData = [
    {
      date: "2021-01-01",
      refNo: "746953Q",
      payorName: "John Doe",
      collectionAmount: 1000,
      accountCode: "9308631",
    },
    {
      date: "2021-01-02",
      refNo: "746954Q",
      payorName: "Jane Smith",
      collectionAmount: 2000,
      accountCode: "9308632",
    },
    {
      date: "2021-01-03",
      refNo: "746955Q",
      payorName: "Sam Johnson",
      collectionAmount: 3000,
      accountCode: "9308633",
    },
    {
      date: "2021-01-04",
      refNo: "746956Q",
      payorName: "Allen Fajilan",
      collectionAmount: 4000,
      accountCode: "9308634",
    },
    {
      date: "2021-01-05",
      refNo: "746957Q",
      payorName: "Carmela Fernando",
      collectionAmount: 5000,
      accountCode: "9308635",
    },
    {
      date: "2021-01-06",
      refNo: "746958Q",
      payorName: "Nicole Mauricio",
      collectionAmount: 6000,
      accountCode: "9308636",
    },
    {
      date: "2021-01-07",
      refNo: "746959Q",
      payorName: "Mhatt Flores",
      collectionAmount: 7000,
      accountCode: "9308637",
    },
    {
      date: "2021-01-08",
      refNo: "746960Q",
      payorName: "Matt Javate",
      collectionAmount: 8000,
      accountCode: "9308638",
    },
    {
      date: "2021-01-09",
      refNo: "746961Q",
      payorName: "Gio Gabriel",
      collectionAmount: 9000,
      accountCode: "9308639",
    },
    {
      date: "2021-01-10",
      refNo: "746962Q",
      payorName: "Paolo Olata",
      collectionAmount: 10000,
      accountCode: "9308640",
    },
  ];

  static largeDummyData = Array.from({ length: 40000 }, (_, index) => ({
    date: `2021-01-${String(index + 1).padStart(2, "0")}`,
    refNo: `7469${index}Q`,
    payorName: `Payor ${index}`,
    collectionAmount: Math.floor(Math.random() * 1000),
    accountCode: `9308${index}`,
  }));

  static dummyPayor = {
    uid: "sdfkdsbksdb",
    name: "John Doe",
    email: "jd@up.edu.ph",
    accountCode: "9308631",
    isUPLBStudent: true,
    studentNo: "2018-12345",
    transactionHistory: [
      {
        date: "2021-01-01",
        refNo: "746953Q",
        collectionAmount: 1000,
        natureOfCollection: "Tuition Fee",
      },
      {
        date: "2021-01-02",
        refNo: "746954Q",
        collectionAmount: 2000,
        natureOfCollection: "Grad Fee",
      },
      {
        date: "2021-01-03",
        refNo: "746955Q",
        collectionAmount: 3000,
        natureOfCollection: "LOA Fee",
      },
      {
        date: "2021-01-04",
        refNo: "746956Q",
        collectionAmount: 4000,
        natureOfCollection: "AWOL Fee",
      },
      {
        date: "2021-01-05",
        refNo: "746957Q",
        collectionAmount: 5000,
        natureOfCollection: "Removal Fee",
      },
      {
        date: "2021-01-06",
        refNo: "746958Q",
        collectionAmount: 6000,
        natureOfCollection: "Dropping Fee",
      },
    ],
  };
}
