// // convert.js
// const XLSX = require("xlsx");
// const fs = require("fs");
// const path = require("path");

// // Update these paths to match your file locations
// const inputFilePath = path.join(__dirname, "input.xlsx");
// const outputFilePath = path.join(__dirname, "output.json");

// // Load the workbook from the Excel file
// const workbook = XLSX.readFile(inputFilePath);

// // Choose the sheet: here, we take the first sheet; you can change this if needed.
// const sheetName = workbook.SheetNames[0];
// const worksheet = workbook.Sheets[sheetName];

// // Convert the worksheet data to JSON.
// // 'defval' ensures that missing values are set to an empty string.
// const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

// // Specify the column headers you want to keep.
// // Update these names to match the column headers in your Excel file.
// const columnsToExtract = ["nature", "accountCode", "responsibilityCode", "objectCode", "objectDescription"];

// // Process the JSON data to extract only the specified columns.
// const filteredData = jsonData.map((row) => {
//   const filteredRow = {};
//   columnsToExtract.forEach((col) => {
//     filteredRow[col] = row[col]; // if a column doesn't exist, it will be undefined (or '' if defval is set)
//   });
//   return filteredRow;
// });

// // Write the filtered data to an output JSON file.
// fs.writeFileSync(outputFilePath, JSON.stringify(filteredData, null, 2), "utf8");

// console.log(
//   `Successfully converted ${inputFilePath} to ${outputFilePath} with columns: ${columnsToExtract.join(", ")}`
// );

// src/utils/convertExcel.js
import * as XLSX from "xlsx";

/**
 * Converts an Excel file to JSON and filters only the specified columns.
 *
 * @param {File} file - The Excel file (from an input element).
 * @param {string[]} columnsToExtract - Array of column names to keep in the JSON.
 * @returns {Promise<Array<Object>>} - A promise that resolves with the filtered JSON data.
 */
export const convertExcelToJson = (file, columnsToExtract = []) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;

      // Read the Excel file as binary string
      const workbook = XLSX.read(data, { type: "binary" });

      // Select the first sheet (or change to a specific sheet name if needed)
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert sheet data to JSON. The defval option assigns a default value for empty cells.
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      // Filter each row to include only the desired columns
      const filteredData = jsonData.map((row) => {
        const filteredRow = {};
        columnsToExtract.forEach((col) => {
          filteredRow[col] = row[col];
        });
        return filteredRow;
      });

      resolve(filteredData);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    // Read the file as a binary string (alternatively, you can use readAsArrayBuffer)
    reader.readAsBinaryString(file);
  });
};
