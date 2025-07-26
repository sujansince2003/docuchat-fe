/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, FileText, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
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
  uploadedAt: string;
}

interface DocumentListProps {
  selectedDocumentId: string | null;
  onSelectDocument: (documentId: string | null) => void;
  onDocumentDeleted: (documentId: string) => void;
  refreshTrigger: number;
}

const DocumentList: React.FC<DocumentListProps> = ({
  selectedDocumentId,
  onSelectDocument,
  onDocumentDeleted,
  refreshTrigger,
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
      toast.success("Document deleted!");
      onDocumentDeleted(documentId);

      if (selectedDocumentId === documentId) {
        onSelectDocument(null);
      }
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast.error(`Failed to delete document: ${error.message}`);
    } finally {
      setDeletingDocId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium mb-2">No PDFs yet</p>
          <p className="text-gray-400 text-sm">
            Upload your first PDF to get started!
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc.id)}
                className={cn(
                  "group relative p-3 rounded-lg cursor-pointer transition-colors flex items-start gap-3",
                  selectedDocumentId === doc.id
                    ? "bg-blue-50 border border-blue-200 text-blue-800 font-medium"
                    : "hover:bg-gray-50 border border-transparent text-gray-700"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors flex-shrink-0",
                    selectedDocumentId === doc.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  )}
                >
                  <FileText className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate flex-grow w-[200px]">
                    {doc.filename}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(doc.uploadedAt)}</span>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className={cn(
                        "ml-2 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 transition-colors flex-shrink-0",
                        selectedDocumentId === doc.id
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      )}
                      disabled={deletingDocId === doc.id}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {deletingDocId === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-5 w-5" />
                        Delete Document?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600">
                        This action cannot be undone. This will permanently
                        delete &quot;{doc.filename}&quot; and remove all
                        associated chat history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-lg">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 rounded-lg"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
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
