import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ResumeVerse — AI-Powered Interactive Resume Generator",
  description:
    "Transform your PDF/DOCX resume into a beautiful, interactive, shareable website using AI. Choose from 3 stunning themes.",
  keywords: ["resume", "portfolio", "AI", "interactive resume", "resume builder", "Gemini AI", "PDF to website"],
  authors: [{ name: "Vikas Kumar" }],
  openGraph: {
    title: "ResumeVerse — AI-Powered Interactive Resume Generator",
    description: "Upload your resume. AI transforms it into a stunning interactive website.",
    type: "website",
    siteName: "ResumeVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeVerse — AI-Powered Interactive Resume Generator",
    description: "Upload your resume. AI transforms it into a stunning interactive website.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
