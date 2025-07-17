// components/AuthWrapper.tsx
"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";
import Image from "next/image";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-lg text-gray-600">Loading session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to PDF Chat!
        </h1>
        <p className="text-lg text-gray-600">Please sign in to continue.</p>
        <Button
          onClick={() => signIn("google")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-xl rounded-lg shadow-md transition-all duration-200 ease-in-out"
        >
          Sign In with Google
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="User Avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm font-medium text-gray-700">
          {session.user?.name || session.user?.email}
        </span>
        <Button
          onClick={() => signOut()}
          variant="outline"
          className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
        >
          Sign Out
        </Button>
      </div>
      {children}
    </>
  );
};

export default AuthWrapper;
