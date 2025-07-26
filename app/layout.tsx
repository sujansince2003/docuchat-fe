import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "./components/Provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// SEO metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://docuchat.ai"),
  title: {
    default: "DocuChat – Chat with your documents using AI",
    template: "%s – DocuChat",
  },
  description:
    "DocuChat lets you chat with your PDFs and documents using AI. Upload, ask, and understand any content instantly.",
  keywords: [
    "AI PDF reader",
    "Chat with documents",
    "AI document assistant",
    "DocuChat",
    "AI knowledge base",
  ],
  openGraph: {
    title: "DocuChat – Chat with your documents using AI",
    description:
      "Upload your PDFs and get instant answers. Powered by GPT technology.",
    url: "https://docuchat.ai",
    siteName: "DocuChat",
    images: [
      {
        url: "/docuchat.png",
        width: 1200,
        height: 630,
        alt: "DocuChat – Chat with your documents using AI",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuChat – Chat with your documents using AI",
    description:
      "Upload your PDFs and get instant answers. Powered by GPT technology.",
    creator: "@docuchat",
    images: ["/favicon-32x32.png"],
  },
  icons: {
    icon: "/favicon-16x16.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <Provider>{children}</Provider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
