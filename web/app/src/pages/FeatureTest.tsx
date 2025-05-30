import React, { useEffect, useState } from "react";
import { convertXlsxToJson, loadJsonFromLocalStorage, saveJsonToLocalStorage } from "../utils/excelToJson";

interface Option {
  // Adjust these keys to match the specific columns you expect.
  nature: string;
  accountCode: string;
  responsibilityCode: string;
  objectCode: string;
  objectDescription: string;
}

export const FeatureTestPage = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  useEffect(() => {
    initializeOptions();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Pass in the file and an array of columns you wish to extract.
      const jsonData = await convertXlsxToJson(file, [
        "nature",
        "accountCode",
        "responsibilityCode",
        "objectCode",
        "objectDescription",
      ]);

      // Optionally, trigger a download of the JSON file.
      // downloadJsonFile(jsonData, 'myData.json');

      // Set the data into state (or process it further as needed).
      setOptions(jsonData);
    } catch (error) {
      console.error("Error converting Excel to JSON:", error);
    }
  };
  const initializeOptions = () => {
    const data = loadJsonFromLocalStorage();
    if (data) {
      setOptions(data);
    }
  };

  const handleSaveSettings = () => {
    const isSaved = saveJsonToLocalStorage(options);
    if (isSaved) {
      alert("Settings saved successfully");
    } else {
      alert("Error saving settings");
    }
  };

  return (
    <div>
      {options && options.length === 0 ? (
        <>
          <h2>Upload Excel File</h2>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        </>
      ) : (
        <>
          <h3>Select an Option</h3>
          <select
            onChange={(e) => setSelectedOption(options.find((option) => option.nature === e.target.value) || null)}
          >
            {options.map((option, index) => (
              <option key={index} value={option.nature}>
                {option.nature}
              </option>
            ))}
          </select>

          <br></br>
          {selectedOption && (
            <div style={{ marginTop: "20px" }}>
              <h3>Selected Option Details</h3>
              <p>
                <strong>Name:</strong> {selectedOption.nature}
              </p>
              <p>
                <strong>Account Code:</strong> {selectedOption.accountCode}
              </p>
              <p>
                <strong>responsibility Code:</strong> {selectedOption.responsibilityCode}
              </p>
            </div>
          )}
          <button onClick={handleSaveSettings}>save settings</button>
          <br></br>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        </>
      )}
    </div>
  );
};
