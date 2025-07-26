/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import type React from "react";
import { useState } from "react";
import { Loader2, CheckCircle2, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

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
      toast.error("Please sign in to upload files.");
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
        formData.append("userId", session.user.id);

        setUploading(true);
        setUploadSuccess(false);

        try {
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
          onDocumentUploaded(data.documentId);
          toast.success("PDF uploaded successfully!");
          // Reset success state after a short delay for visual feedback
          setTimeout(() => setUploadSuccess(false), 3000);
        } catch (error: any) {
          console.error("Error uploading file:", error);
          toast.error(`Failed to upload file: ${error.message}`);
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
      className="group relative bg-gray-900 hover:bg-gray-800 text-white rounded-xl p-4 cursor-pointer transition-colors"
    >
      <div className="flex items-center justify-center flex-col gap-2">
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            <span className="text-sm">Uploading...</span>
            {fileName && (
              <span className="text-xs text-gray-300 truncate max-w-full px-2">
                {fileName}
              </span>
            )}
          </>
        ) : uploadSuccess ? (
          <>
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <span className="text-sm">Upload Complete!</span>
          </>
        ) : (
          <>
            <Plus className="h-6 w-6" />
            <span className="text-sm">Upload PDF</span>
            {!session?.user?.id && (
              <span className="text-xs text-red-300 mt-1">
                (Sign in to upload)
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
