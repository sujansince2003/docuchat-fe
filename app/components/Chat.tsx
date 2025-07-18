/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Send,
  Bot,
  User,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  async function sendQuery() {
    if (
      !message.trim() ||
      isLoading ||
      !session?.user?.id ||
      !selectedDocumentId
    ) {
      alert("Please sign in and select a PDF to chat.");
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && message.trim() && !isLoading) {
      sendQuery();
    }
  };

  return (
    <div className="flex h-screen flex-col relative">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">AI Chat</h1>
          <p className="text-sm text-slate-500">
            {selectedDocumentId
              ? "Ask questions about your PDF"
              : "Select a PDF to start chatting"}
          </p>
        </div>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto space-y-6">
          {!session?.user?.id ? (
            <div className="text-center py-20">
              <div className="p-4 bg-slate-100 rounded-2xl inline-block mb-4">
                <User className="h-12 w-12 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg">
                Please sign in to start chatting
              </p>
            </div>
          ) : !selectedDocumentId ? (
            <div className="text-center py-20">
              <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl inline-block mb-4">
                <Sparkles className="h-12 w-12 text-blue-600" />
              </div>
              <p className="text-slate-600 text-lg font-medium mb-2">
                Ready to chat!
              </p>
              <p className="text-slate-500">
                Upload a PDF on the left to start a conversation
              </p>
            </div>
          ) : (
            chatHistory.length === 0 &&
            !isLoading && (
              <div className="text-center py-20">
                <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl inline-block mb-4">
                  <Bot className="h-12 w-12 text-green-600" />
                </div>
                <p className="text-slate-600 text-lg font-medium mb-2">
                  Let&apos;s explore your PDF!
                </p>
                <p className="text-slate-500">
                  Ask me anything about the content
                </p>
              </div>
            )
          )}

          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-4 max-w-4xl",
                msg.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.sender === "ai" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-white border border-slate-200"
                )}
              >
                <div
                  className={cn(
                    "prose prose-sm max-w-none",
                    msg.sender === "user" ? "prose-invert" : "prose-slate"
                  )}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
                <div
                  className={cn(
                    "text-xs mt-2 opacity-70",
                    msg.sender === "user" ? "text-blue-100" : "text-slate-500"
                  )}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-slate-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-slate-200">
        <div className="max-w-4xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything about the PDF..."
              className="pr-12 py-3 rounded-2xl border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white shadow-sm"
              disabled={isLoading || !session?.user?.id || !selectedDocumentId}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Sparkles className="h-4 w-4 text-slate-400" />
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
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
