import { useRef } from "react";
import { toastError, toastSuccess } from "../UI/ToastService";

export function ImageUpload() {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (!file) {
      return; // Exit if no file is selected
    }

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      toastError("Please upload an image file (e.g., JPEG, PNG).");
      fileInputRef.current.value = ""; // Clear the file input
      return;
    }

    // Check if the file size is over 10MB
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toastWarning("File size must be less than 10MB.");
      fileInputRef.current.value = ""; // Clear the file input
      return;
    }

    // If validation passes, you can proceed with uploading the file
    toastSuccess("File selected successfully!");
    console.log("File is valid:", file);
  };

  return (
    <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36 h-32 flex items-center justify-center">
      <label
        htmlFor="upload"
        className="flex flex-col items-center gap-2 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 fill-white stroke-indigo-500"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-gray-600 font-medium text-xs">Upload file</span>
      </label>
      <input
        id="upload"
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}