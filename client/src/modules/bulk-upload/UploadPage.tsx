import { useState } from "react";
import Papa from "papaparse";

type UploadData = {
  date: string;
  department: string;
  type: string;
  category: string;
  amount: string;
  description: string;
};

export default function UploadPage() {
  const [data, setData] = useState<UploadData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // 🔹 Handle file upload
  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData = result.data as UploadData[];

        // 🔹 Basic validation
        const validationErrors: string[] = [];

        parsedData.forEach((row, index) => {
          if (!row.date || !row.department || !row.amount) {
            validationErrors.push(`Row ${index + 1} is missing required fields`);
          }
        });

        setErrors(validationErrors);
        setData(parsedData);
      },
    });
  };

  // 🔹 Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleConfirm = () => {
    alert("Data successfully uploaded!");
    setData([]);
    setErrors([]);
  };

  return (
    <div className="space-y-6">
      
      <h1 className="text-xl font-semibold">Bulk Upload</h1>

      {/* 🔹 Upload Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed p-6 text-center bg-white rounded"
      >
        <p className="text-gray-500">
          Drag & Drop CSV file here or click to upload
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            if (e.target.files) handleFile(e.target.files[0]);
          }}
          className="mt-3"
        />
      </div>

      {/* 🔹 Validation Errors */}
      {errors.length > 0 && (
        <div className="bg-red-100 p-3 rounded text-red-600">
          <h2 className="font-semibold">Validation Errors:</h2>
          <ul className="list-disc pl-5">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔹 Preview Table */}
      {data.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Preview Data</h2>

          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Dept</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Description</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="text-center">
                  <td className="p-2 border">{row.date}</td>
                  <td className="p-2 border">{row.department}</td>
                  <td className="p-2 border">{row.type}</td>
                  <td className="p-2 border">{row.category}</td>
                  <td className="p-2 border">₱ {row.amount}</td>
                  <td className="p-2 border">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🔹 Confirm Upload */}
          <button
            onClick={handleConfirm}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Confirm Upload
          </button>
        </div>
      )}
    </div>
  );
}