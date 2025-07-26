/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Bot, User, Sparkles } from "lucide-react";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

interface ChatProps {
  selectedDocumentId: string | null;
}

const Chat: React.FC<ChatProps> = ({ selectedDocumentId }) => {
  const { data: session } = useSession();
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  useEffect(() => {
    async function loadChatHistory() {
      if (!session?.user?.id || !selectedDocumentId) {
        setChatHistory([]);
        setChatSessionId(null);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/chat-history?userId=${session.user.id}&documentId=${selectedDocumentId}`
        );
        if (!res.ok) {
          throw new Error(`Failed to load chat history: ${res.status}`);
        }
        const data = await res.json();
        setChatHistory(
          data.messages.map((msg: any) => ({
            id: msg.id,
            sender: msg.sender,
            content: msg.content,
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
        );
        setChatSessionId(data.chatSessionId);
      } catch (error) {
        console.error("Error loading chat history:", error);
        setChatHistory([]);
        setChatSessionId(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadChatHistory();
  }, [session?.user?.id, selectedDocumentId]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  async function sendQuery() {
    if (
      !message.trim() ||
      isLoading ||
      !session?.user?.id ||
      !selectedDocumentId
    ) {
      toast.error("Please sign in and select a PDF to chat.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      sender: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          documentId: selectedDocumentId,
          userQuery: userMessage.content,
          chatSessionId: chatSessionId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      console.log("AI Answer:", data.answer);

      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        sender: "ai",
        content: data.answer || "Sorry, I couldn't get a response.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatHistory((prev) => [...prev, aiMessage]);
      setChatSessionId(data.chatSessionId);
    } catch (error: any) {
      console.error("Chat processing failed:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        sender: "ai",
        content: `Error: Could not fetch response. Please try again. (${error.message})`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      message.trim() &&
      !isLoading
    ) {
      event.preventDefault();
      sendQuery();
    }
  };

  return (
    <div className="flex-1 flex flex-col relative bg-gray-100 h-full">
      <div className="flex-1 overflow-y-auto p-4" ref={scrollAreaRef}>
        <div className=" pb-24">
          {" "}
          {!session?.user?.id ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to PDF Chat
              </h2>
              <p className="text-gray-600">Please sign in to start chatting</p>
            </div>
          ) : !selectedDocumentId ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Start a conversation
              </h2>
              <p className="text-gray-600">
                Upload a PDF document to start an AI-powered conversation
              </p>
            </div>
          ) : (
            chatHistory.length === 0 &&
            !isLoading && (
              <div className="text-center py-16 ">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Let&apos;s explore your PDF!
                </h2>
                <p className="text-gray-600">
                  Ask me anything about the content
                </p>
              </div>
            )
          )}
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex mb-6",
                msg.sender === "user" ? "justify-end" : "justify-start",
                msg.sender === "user" ? "gap-4" : "gap-4"
              )}
            >
              {msg.sender === "ai" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                  <Bot className="h-4 w-4 text-gray-600" />
                </div>
              )}

              <div
                className={cn(
                  "rounded-lg px-4 py-3 max-w-[80%]",
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200"
                )}
              >
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
                <div
                  className={cn(
                    "text-xs mt-1",
                    msg.sender === "user" ? "text-blue-200" : "text-gray-500"
                  )}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mt-1">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 mb-6">
              {" "}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                <Bot className="h-4 w-4 text-gray-600" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto flex  gap-2 items-center justify-center">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything about the PDF..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white"
              rows={1}
              style={{ minHeight: "50px" }}
              disabled={isLoading || !session?.user?.id || !selectedDocumentId}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Sparkles className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <Button
            disabled={
              !message.trim() ||
              isLoading ||
              !session?.user?.id ||
              !selectedDocumentId
            }
            onClick={sendQuery}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-12 py-6 mb-2 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4 " />
            )}
          </Button>
        </div>
        {!selectedDocumentId && session?.user?.id && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Select a PDF from the sidebar to start chatting
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat;
