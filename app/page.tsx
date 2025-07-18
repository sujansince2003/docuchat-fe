"use client";

import { useState, useCallback } from "react";
import DocumentList from "./components/DocumentList";
import FileUpload from "./components/FileUpload";
import AuthWrapper from "./components/AuthWrapper";
import Chat from "./components/Chat";

export default function HomePage() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const [refreshDocsTrigger, setRefreshDocsTrigger] = useState(0);

  const handleDocumentChange = useCallback(
    (documentId: string | null = null) => {
      setRefreshDocsTrigger((prev) => prev + 1);
      if (documentId) {
        setSelectedDocumentId(documentId);
      } else {
        setSelectedDocumentId(null);
      }
    },
    []
  );

  return (
    <AuthWrapper>
      <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Left Sidebar - Modern Glass Effect */}
        <div className="lg:w-[40%] min-h-[30vh] lg:min-h-screen flex flex-col p-6 backdrop-blur-sm bg-white/70 border-r border-white/20 shadow-xl">
          <div className="mb-6 h-1/3">
            <FileUpload
              onDocumentUploaded={(docId) => handleDocumentChange(docId)}
            />
          </div>
          <div className="flex-1">
            <DocumentList
              selectedDocumentId={selectedDocumentId}
              onSelectDocument={setSelectedDocumentId}
              onDocumentDeleted={() => handleDocumentChange(null)}
              refreshTrigger={refreshDocsTrigger}
            />
          </div>
        </div>

        {/* Right Section - Modern Chat Area */}
        <div className="lg:w-[60%] min-h-[70vh] lg:min-h-screen relative bg-gradient-to-br from-white to-slate-50">
          <Chat selectedDocumentId={selectedDocumentId} />
        </div>
      </div>
    </AuthWrapper>
  );
}
