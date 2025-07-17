"use client";
import React, { useState } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface FileUploadProps {
  onDocumentUploaded: (documentId: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDocumentUploaded }) => {
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFileUpload() {
    if (uploading || !session?.user?.id) {
      alert("Please sign in to upload files.");
      return;
    }

    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", ".pdf");
    el.addEventListener("change", async () => {
      if (el.files && el.files.length > 0) {
        const file = el.files[0];
        setFileName(file.name);
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("userId", session.user.id); // Pass userId to the API route

        setUploading(true);
        setUploadSuccess(false); // Reset success state on new upload attempt

        try {
          // Changed endpoint to a Next.js API route
          const res = await fetch("/api/upload-pdf", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
              errorData.message || `Upload failed with status: ${res.status}`
            );
          }

          const data = await res.json();
          console.log(
            "File uploaded to backend, document ID:",
            data.documentId
          );
          setUploadSuccess(true);
          onDocumentUploaded(data.documentId); // Pass the new document ID to parent
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("Error uploading file:", error);
          alert(`Failed to upload file: ${error.message}`);
          setUploadSuccess(false);
        } finally {
          setUploading(false);
        }
      }
    });
    el.click();
  }

  return (
    <div
      onClick={handleFileUpload}
      className="bg-slate-900 text-white shadow-2xl flex flex-col justify-center items-center border-2 rounded-xl p-8 cursor-pointer hover:bg-slate-800 transition-colors duration-200 w-full h-full"
    >
      <div className="flex justify-center items-center flex-col gap-2 text-center">
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <h1 className="text-xl font-semibold">Uploading PDF...</h1>
            {fileName && (
              <p className="text-sm text-gray-300 truncate w-full px-2">
                {fileName}
              </p>
            )}
          </>
        ) : uploadSuccess ? (
          <>
            <CheckCircle2 className="h-8 w-8 text-green-400" />
            <h1 className="text-xl font-semibold">PDF Uploaded!</h1>
            {fileName && (
              <p className="text-sm text-gray-300 truncate w-full px-2">
                {fileName}
              </p>
            )}
            <p className="text-sm text-gray-300">You can now ask questions.</p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-300" />
            <h1 className="text-xl font-semibold">Upload your PDF file</h1>
            <p className="text-sm text-gray-300">Click to select a file</p>
            {!session?.user?.id && (
              <p className="text-sm text-red-400 mt-2">
                Please sign in to enable uploads.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
