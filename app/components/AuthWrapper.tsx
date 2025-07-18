"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import type React from "react";
import Image from "next/image";
import LandingPage from "./LandingPage";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
        </div>
        <p className="text-xl text-slate-600 font-medium">
          Loading your session...
        </p>
      </div>
    );
  }

  if (!session) {
    return <LandingPage />;
  }

  return (
    <>
      <div className="absolute top-6 right-6 flex items-center gap-3 z-50 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/20">
        {session.user?.image && (
          <Image
            src={session.user.image || "/placeholder.svg"}
            alt="User Avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full ring-2 ring-blue-500/20"
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-700">
            {session.user?.name}
          </span>
          <span className="text-xs text-slate-500">{session.user?.email}</span>
        </div>
        <Button
          onClick={() => signOut()}
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </>
  );
};

export default AuthWrapper;
