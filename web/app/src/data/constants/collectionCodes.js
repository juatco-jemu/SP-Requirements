const fs = require("fs");
const parse = require("csv-parse");

const filePath = "revolving-fund-oct-2024.csv";
const desiredColumns = ["nature", "objectCode"]; // Replace with your actual column names

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  parse(
    data,
    {
      columns: true, // Treats the first row as headers
      skip_empty_lines: true,
    },
    (err, records) => {
      if (err) {
        console.error("Error parsing the CSV:", err);
        return;
      }

      // Remove the first row (headers) and the last three rows
      const filteredRecords = records.slice(1, records.length - 3);

      // Select only the desired columns
      const selectedColumns = filteredRecords.map((record) => {
        const selected = {};
        desiredColumns.forEach((col) => {
          if (record.hasOwnProperty(col)) {
            selected[col] = record[col];
          }
        });
        return selected;
      });

      console.log(selectedColumns);
    }
  );
});
