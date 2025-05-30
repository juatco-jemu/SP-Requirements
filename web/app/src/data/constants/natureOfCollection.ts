import React, { useEffect, useState } from "react";
import { parse } from "csv-parse/browser/esm";

export const natureOfCollectionValues = [
  "CTC-Form 5",
  "Student I.D.",
  "Certifications",
  "Application Fee",
  "Transcript of Records (TOR)",
  "LOA Fee",
  "Removal Fee",
  "UPHRS Fee",
  "Dropping Fee",
  "True Copy of Grades (TCG)",
  "AWOL Fee",
  "Bond Fee (BAO)",
  "Verification Fee",
  "Admission Fee",
  "Deferment Fee",
  "Billing (Utilities)",
  "BAC Registration fee",
  "Cancelled OR",
];

// export const CollectionValues = () => {
//   const [options, setOptions] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("revolving-fund-oct-2024.csv");
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const text = await response.text();

//         parse(
//           text,
//           {
//             columns: true, // Treats the first row as headers
//             skip_empty_lines: true,
//             from_line: 2, // Skip the first row
//             to_line: -4, // Skip the last three rows
//           },
//           (err, records) => {
//             if (err) {
//               console.error("Error parsing CSV:", err);
//               return;
//             }

//             // Specify the columns you want to keep
//             const desiredColumns = ["nature", "objectCode"]; // Replace with your actual column names

//             // Filter the records to include only the desired columns
//             interface RecordType {
//               [key: string]: any;
//             }

//             const filteredRecords: RecordType[] = records.map((record: RecordType) => {
//               const filteredRecord: RecordType = {};
//               desiredColumns.forEach((col) => {
//                 if (record.hasOwnProperty(col)) {
//                   filteredRecord[col] = record[col];
//                 }
//               });
//               return filteredRecord;
//             });

//             const stringOptions = filteredRecords.map((record) => JSON.stringify(record));
//             setOptions(stringOptions);
//           }
//         );
//       } catch (error) {
//         console.error("Error fetching or parsing CSV file:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return options;
// };
