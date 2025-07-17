// app/page.tsx
"use client"; // This is a client component as it uses hooks and state

// Import the new DocumentList component
import React, { useState, useCallback } from "react";
import DocumentList from "./components/DocumentList";
import FileUpload from "./components/FileUpload";
import AuthWrapper from "./components/AuthWrapper";
import Chat from "./components/Chat";

export default function HomePage() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const [refreshDocsTrigger, setRefreshDocsTrigger] = useState(0); // State to trigger document list refresh

  // Callback to refresh document list after upload or deletion
  const handleDocumentChange = useCallback(
    (documentId: string | null = null) => {
      setRefreshDocsTrigger((prev) => prev + 1); // Increment to trigger useEffect in DocumentList
      if (documentId) {
        setSelectedDocumentId(documentId); // Select the newly uploaded document
      } else {
        setSelectedDocumentId(null); // Deselect if no document ID is passed (e.g., on deletion)
      }
    },
    []
  );

  return (
    <AuthWrapper>
      <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
        {/* Left Sidebar for File Upload and Document List */}
        <div className="lg:w-40%] min-h-[30vh] lg:min-h-screen flex flex-col p-4 border-b-2 lg:border-r-2 lg:border-b-0">
          <div className="mb-4 h-1/3">
            {" "}
            {/* Allocate space for FileUpload */}
            <FileUpload
              onDocumentUploaded={(docId) => handleDocumentChange(docId)}
            />
          </div>
          <div className="flex-1">
            {" "}
            {/* Allocate remaining space for DocumentList */}
            <DocumentList
              selectedDocumentId={selectedDocumentId}
              onSelectDocument={setSelectedDocumentId}
              onDocumentDeleted={() => handleDocumentChange(null)} // Refresh and deselect on delete
              refreshTrigger={refreshDocsTrigger} // Pass trigger to DocumentList
            />
          </div>
        </div>

        {/* Right Section for Chat */}
        <div className="lg:w-[70%] min-h-[70vh] lg:min-h-screen border-l-0 lg:border-l-2 border-t-2 lg:border-t-0 relative bg-white">
          <Chat selectedDocumentId={selectedDocumentId} />
        </div>
      </div>
    </AuthWrapper>
  );
}
