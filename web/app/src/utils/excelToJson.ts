// excelToJson.ts
import * as XLSX from "xlsx";

/**
 * Converts an Excel file to JSON.
 *
 * @param file - The Excel file (as a File object) to convert.
 * @param columns - An array of strings representing the specific column names to extract.
 * @returns A Promise that resolves to an array of objects containing only the specified columns.
 */
export function convertXlsxToJson(file: File, columns: string[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    const reader = new FileReader();

    // When file reading is complete...
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        // Read the file as a binary string.
        const data = event.target?.result;
        if (!data) {
          return reject(new Error("Failed to read file data"));
        }

        // Parse the workbook.
        const workbook = XLSX.read(data, { type: "binary" });

        // For this example, we use the first sheet. (You can modify this as needed.)
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert the sheet data to JSON.
        let jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        // If specific columns are provided, filter each row to only include those columns.
        if (columns.length > 0) {
          jsonData = jsonData.map((row) => {
            const filteredRow: Record<string, any> = {};
            columns.forEach((col) => {
              filteredRow[col] = row[col];
            });
            return filteredRow;
          });
        }

        jsonData = jsonData.map((row, index) => ({
          ...row,
          id: index,
        }));

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    // Begin reading the file.
    reader.readAsBinaryString(file);
  });
}

/**
 * Optional: Creates and triggers a download of a JSON file.
 *
 * @param jsonData - The JSON data to download.
 * @param fileName - The name for the downloaded file.
 */
export function downloadJsonFile(jsonData: any, fileName: string = "output.json"): void {
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Saves the JSON data to localStorage.
 *
 * @param jsonData - The JSON data to store.
 * @param key - The key under which the data will be saved.
 */
export function saveJsonToLocalStorage(jsonData: any, key: string = "excelData"): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(jsonData));
    console.log("Data saved to localStorage");
    return true;
  } catch (error) {
    console.error("Error saving JSON to localStorage:", error);
    return false;
  }
}

/**
 * Loads JSON data from localStorage.
 *
 * @param key - The key under which the data is stored.
 * @returns The parsed JSON data or null if not found.
 */
export function loadJsonFromLocalStorage(key: string = "excelData"): any | null {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading JSON from localStorage:", error);
    return null;
  }
}
