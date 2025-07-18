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
      toast.success("Successfully deleted document!");
      onDocumentDeleted(documentId);

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
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          Your PDFs
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20 animate-pulse"></div>
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 relative z-10" />
          </div>
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="p-4 bg-slate-100 rounded-2xl mb-4">
            <FileText className="h-12 w-12 text-slate-400" />
          </div>
          <p className="text-slate-500 text-lg font-medium mb-2">No PDFs yet</p>
          <p className="text-slate-400 text-sm">
            Upload your first PDF to get started!
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={cn(
                  "group relative flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 border",
                  selectedDocumentId === doc.id
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg ring-1 ring-blue-200"
                    : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-md"
                )}
                onClick={() => onSelectDocument(doc.id)}
              >
                {/* Selection indicator */}
                {selectedDocumentId === doc.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
                )}

                <div className="flex items-center gap-4 flex-grow min-w-0">
                  <div
                    className={cn(
                      "p-3 rounded-xl transition-colors",
                      selectedDocumentId === doc.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                    )}
                  >
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate text-sm mb-1">
                      {doc.filename}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(doc.uploadedAt)}</span>
                    </div>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
                    {deletingDocId === doc.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <div className="p-2 bg-red-100 rounded-xl">
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </div>
                        Delete PDF?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-600">
                        This action cannot be undone. This will permanently
                        delete &quot;{doc.filename}&quot; and remove all
                        associated chat history from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 rounded-xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDocument(doc.id);
                        }}
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
