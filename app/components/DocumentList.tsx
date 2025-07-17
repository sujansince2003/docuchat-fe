// components/DocumentList.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have this utility

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
interface Document {
  id: string;
  filename: string;
  uploadedAt: string; // ISO string
}

interface DocumentListProps {
  selectedDocumentId: string | null;
  // ✨ CHANGED: onSelectDocument now accepts string OR null for deselection ✨
  onSelectDocument: (documentId: string | null) => void;
  onDocumentDeleted: (documentId: string) => void;
  refreshTrigger: number; // ✨ ADDED: This prop is now part of the interface ✨
}

const DocumentList: React.FC<DocumentListProps> = ({
  selectedDocumentId,
  onSelectDocument,
  onDocumentDeleted,
  refreshTrigger, // ✨ DESTRUCTURED: The new prop is used here ✨
}) => {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      if (!session?.user?.id) {
        setDocuments([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/documents?userId=${session.user.id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch documents: ${res.status}`);
        }
        const data = await res.json();
        setDocuments(data.documents);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    }
    // ✨ CHANGED: Added refreshTrigger to the dependency array ✨
    // This ensures documents are re-fetched when the parent signals a change (upload/delete)
    fetchDocuments();
  }, [session?.user?.id, refreshTrigger]);

  const handleDeleteDocument = async (documentId: string) => {
    if (!session?.user?.id || deletingDocId === documentId) return;

    setDeletingDocId(documentId);
    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Failed to delete document: ${res.status}`
        );
      }

      console.log(`Document ${documentId} deleted successfully.`);
      toast.success("Successfully deleted document!");
      // Notify parent component that a document was deleted.
      // The parent's `handleDocumentChange(null)` will then trigger `refreshTrigger`
      // and also set `selectedDocumentId` to `null`.
      onDocumentDeleted(documentId);

      // ✨ CHANGED: If the deleted document was the selected one, explicitly deselect it ✨
      // This ensures the chat area clears if the active document is removed.
      if (selectedDocumentId === documentId) {
        onSelectDocument(null);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast.error(`Failed to delete document: ${error.message}`);
      alert(`Failed to delete document: ${error.message}`);
    } finally {
      setDeletingDocId(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 bg-gray-100 rounded-lg shadow-inner">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Your Uploaded PDFs
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : documents.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">
          No PDFs uploaded yet. Upload one!
        </p>
      ) : (
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200",
                  selectedDocumentId === doc.id
                    ? "bg-blue-100 text-blue-800 shadow-md border border-blue-300"
                    : "bg-white hover:bg-gray-50 shadow-sm border border-gray-200"
                )}
                onClick={() => onSelectDocument(doc.id)}
              >
                <div className="flex items-center gap-3 flex-grow min-w-0">
                  <FileText className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium truncate flex-grow max-w-60">
                    {doc.filename}
                  </span>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger className="cursor-pointer p-2 rounded-full bg-gray-100">
                    {deletingDocId === doc.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure want to delete?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the file and remove all associated data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent selecting document when deleting
                          handleDeleteDocument(doc.id);
                        }}
                      >
                        <Trash2 />
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default DocumentList;
