"use client";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import type React from "react";
import LandingPage from "./LandingPage";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { status } = useSession();

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

  if (status === "unauthenticated") {
    return <LandingPage />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
