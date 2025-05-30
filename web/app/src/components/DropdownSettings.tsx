import React, { useEffect, useState } from "react";
import { convertXlsxToJson, loadJsonFromLocalStorage, saveJsonToLocalStorage } from "../utils/excelToJson.ts";
import { Option } from "../types/RevolvingFundItems.ts";
import { CustomModalImageInstruction } from "./CustomModal.tsx";
import { CustomButton } from "./ui/CustomButton.tsx";
import { CircleHelpIcon } from "lucide-react";

import help_image from "../assets/images/instructions/cashier_app_dropdown_settings_sample_file_with_instructions.png";
import { set } from "rsuite/esm/internals/utils/date/index";
import { MessageModal } from "./SuccessModal.tsx";

type DropDownSettingsProps = {
  onClose: () => void;
};

export const DropDownSettings = ({ onClose }: DropDownSettingsProps) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  useEffect(() => {
    initializeOptions();
    const storedFileName = localStorage.getItem("uploadedFileName");
    if (storedFileName) {
      setSelectedFile({ name: storedFileName } as File);
    }
  }, []);

  const clearStoredFileName = () => {
    localStorage.removeItem("uploadedFileName");
    setSelectedFile(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    localStorage.setItem("uploadedFileName", file.name); // Store in localStorage

    try {
      // Pass in the file and an array of columns you wish to extract.
      const jsonData = await convertXlsxToJson(file, [
        "nature",
        "accountCode",
        "responsibilityCode",
        "objectCode",
        "objectDescription",
        "mfoPap",
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

  const handleHelpButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleSaveSettings = () => {
    const isSaved = saveJsonToLocalStorage(options);
    if (isSaved) {
      // alert("Settings saved successfully");
      setMessageModalOpen(true);
    } else {
      setErrorModalOpen(true);
    }
  };

  const handleClose = () => {
    setMessageModalOpen(false);
    setErrorModalOpen(false);
    onClose();
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Change Fund Code</h3>

      <div className="flex flex-col gap-5 justify-center items-start mb-4">
        <div>
          <div className="flex items-center mb-2">
            <label className="block text-sm font-small text-gray-700">Current Fund Code: </label>
            <p className="text-sm font-bold ml-2">{selectedFile ? selectedFile.name : "No fund code selected"}</p>
          </div>
          <p className="text-sm text-gray-500">
            This is the fund code that will be used in the system. Please ensure that the uploaded file contains the
            correct fund codes.
          </p>
        </div>
        <div className="flex items-center">
          <label className="block text-m font-medium text-gray-700">Upload Excel File</label>
          <CustomButton variant="ghost" size="icon" className="text-blue-900" onClick={handleHelpButtonClick}>
            <CircleHelpIcon />
          </CustomButton>
        </div>

        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </div>
      <div className="flex justify-end">
        <CustomButton onClick={handleSaveSettings} className="bg-up_green text-white hover:bg-up_green-hover">
          Save settings
        </CustomButton>
      </div>

      {/* Help Modal */}
      {isModalOpen && (
        <CustomModalImageInstruction onClose={() => setIsModalOpen(false)} title="Guide to Uploading Excel File Format">
          <div className="flex justify-center items-center">
            <img src={help_image} alt="Help Guide" className="w-6xl max-w-full h-auto object-contain" />
          </div>
        </CustomModalImageInstruction>
      )}

      {messageModalOpen && <MessageModal onClose={handleClose} message="Fund Code Successfully Changed!" />}
      {errorModalOpen && <MessageModal onClose={handleClose} message="Failed to Change Fund Code!" />}
    </div>
  );
};
