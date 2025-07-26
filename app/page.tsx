"use client";

import { useState, useCallback, useEffect } from "react";
import DocumentList from "./components/DocumentList";
import FileUpload from "./components/FileUpload";
import AuthWrapper from "./components/AuthWrapper";
import Chat from "./components/Chat";
import { LogOut, Menu, X, Bot, FileText } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const [refreshDocsTrigger, setRefreshDocsTrigger] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleDocumentChange = useCallback(
    (documentId: string | null = null) => {
      setRefreshDocsTrigger((prev) => prev + 1);
      setSelectedDocumentId(documentId);
      if (isMobile) setSidebarOpen(false);
    },
    [isMobile]
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? "w-[380px]" : "w-0 md:w-20"} 
            h-full
            bg-white
            border-r border-gray-200
            flex flex-col
            shadow-lg
            z-30
            transition-all duration-300 ease-in-out
            fixed md:relative
          `}
        >
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div
                className={`flex items-center ${
                  sidebarOpen ? "justify-between" : "justify-center"
                }`}
              >
                {sidebarOpen ? (
                  <>
                    <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-0">
                      {sidebarOpen ? (
                        <>DocuChat</>
                      ) : (
                        <Bot className="h-5 w-5 text-blue-500" />
                      )}
                    </h1>
                    <button
                      onClick={toggleSidebar}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={toggleSidebar}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <Menu className="h-5 w-5 text-gray-600" />
                  </button>
                )}
              </div>

              {sidebarOpen && (
                <div className="mt-4">
                  <FileUpload
                    onDocumentUploaded={(docId) => handleDocumentChange(docId)}
                  />
                </div>
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              {sidebarOpen ? (
                <>
                  <div className="p-4">
                    <h2 className="text-sm font-medium text-gray-700 mb-3">
                      Your Documents
                    </h2>
                  </div>
                  <div className="px-4 pb-4 h-[calc(100%-40px)]">
                    <DocumentList
                      selectedDocumentId={selectedDocumentId}
                      onSelectDocument={setSelectedDocumentId}
                      onDocumentDeleted={() => handleDocumentChange(null)}
                      refreshTrigger={refreshDocsTrigger}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center pt-4">
                  <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-gray-100 rounded-lg mb-4"
                  >
                    <FileText className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            {session?.user && (
              <div className="p-3 border-t border-gray-200 flex-shrink-0">
                {sidebarOpen ? (
                  <div className="flex items-center gap-3">
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.user.name || session.user.email}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <Button
                      onClick={() => signOut()}
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <LogOut className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Button
                      onClick={() => signOut()}
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <LogOut className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        <main
          className={`flex-1 flex flex-col h-full transition-all duration-300 ${
            sidebarOpen ? "md:ml-0" : "md:ml-0"
          }`}
        >
          <header className="bg-white border-b border-gray-200 p-0 shadow-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </header>

          <Chat selectedDocumentId={selectedDocumentId} />
        </main>
      </div>
    </AuthWrapper>
  );
}
