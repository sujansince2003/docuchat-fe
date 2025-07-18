"use client";

import type React from "react";
import { useState } from "react";
import { Upload, Loader2, CheckCircle2, Sparkles } from "lucide-react";
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
      className="group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl flex flex-col justify-center items-center border border-slate-700 rounded-3xl p-8 cursor-pointer hover:from-slate-800 hover:to-slate-700 transition-all duration-300 w-full h-full overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
        <Sparkles className="h-6 w-6 text-blue-400" />
      </div>

      <div className="relative z-10 flex justify-center items-center flex-col gap-4 text-center">
        {uploading ? (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-30 animate-pulse"></div>
              <Loader2 className="h-12 w-12 animate-spin text-blue-400 relative z-10" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Uploading PDF...
            </h1>
            {fileName && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-600">
                <p className="text-sm text-slate-300 truncate max-w-48">
                  {fileName}
                </p>
              </div>
            )}
            <div className="w-full bg-slate-700 rounded-full h-1 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </>
        ) : uploadSuccess ? (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-30"></div>
              <CheckCircle2 className="h-12 w-12 text-green-400 relative z-10" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              PDF Uploaded!
            </h1>
            {fileName && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-600">
                <p className="text-sm text-slate-300 truncate max-w-48">
                  {fileName}
                </p>
              </div>
            )}
            <p className="text-sm text-slate-400">
              Ready for AI-powered conversations
            </p>
          </>
        ) : (
          <>
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative z-10 p-4 bg-slate-800 rounded-2xl border border-slate-600 group-hover:border-slate-500 transition-colors">
                <Upload className="h-8 w-8 text-slate-300 group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
            <h1 className="text-2xl font-bold group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              Upload your PDF
            </h1>
            <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
              Click to select a file and start chatting
            </p>
            {!session?.user?.id && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-2">
                <p className="text-sm text-red-400">
                  Please sign in to enable uploads
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
