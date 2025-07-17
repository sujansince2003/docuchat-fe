/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Chat.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bot, User } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react"; // Import useSession

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
  const [chatSessionId, setChatSessionId] = useState<string | null>(null); // To store the current chat session ID

  // Scroll to bottom effect
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  // Load chat history for the selected document/user when component mounts or document changes
  useEffect(() => {
    async function loadChatHistory() {
      if (!session?.user?.id || !selectedDocumentId) {
        setChatHistory([]); // Clear history if no user or document selected
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
        setChatSessionId(data.chatSessionId); // Set the loaded chat session ID
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
      // Changed endpoint to a Next.js API route
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          documentId: selectedDocumentId,
          userQuery: userMessage.content,
          chatSessionId: chatSessionId, // Pass existing session ID or null
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
      setChatSessionId(data.chatSessionId); // Update with new session ID if created
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
    <div className="flex h-screen flex-col p-4 relative">
      {/* Chat History Display */}
      <ScrollArea className="flex-1 pr-4 mb-20" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4">
          {!session?.user?.id ? (
            <div className="text-center text-gray-500 mt-20">
              Please sign in to start chatting.
            </div>
          ) : !selectedDocumentId ? (
            <div className="text-center text-gray-500 mt-20">
              Upload a PDF on the left to start a new chat session.
            </div>
          ) : (
            chatHistory.length === 0 &&
            !isLoading && (
              <div className="text-center text-gray-500 mt-20">
                Start a conversation about your PDF!
              </div>
            )
          )}

          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-3",
                msg.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.sender === "ai" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <Bot size={18} />
                </div>
              )}
              <div
                className={cn(
                  "p-3 rounded-lg max-w-[75%]",
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                )}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
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
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-start gap-3 mt-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                <Bot size={18} />
              </div>
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none animate-pulse">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="fixed bottom-4 left-[65%] -translate-x-1/2 w-[58%] flex gap-2 p-4 bg-white border-t rounded-lg shadow-lg">
        <Input
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Ask me anything about the PDF..."
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={isLoading || !session?.user?.id || !selectedDocumentId}
        />
        <Button
          disabled={
            !message.trim() ||
            isLoading ||
            !session?.user?.id ||
            !selectedDocumentId
          }
          onClick={sendQuery}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span className="ml-2">Send</span>
        </Button>
      </div>
    </div>
  );
};

export default Chat;
