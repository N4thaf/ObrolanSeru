import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ObrolanSeru — Game Kartu & Truth or Dare",
  description: "Game kartu pertanyaan dan truth or dare seru bareng teman, pasangan, atau keluarga. Main offline atau online bareng!",
  keywords: ["game kartu", "truth or dare", "icebreaker", "deep talk", "kenalan"],
  icons: {
    icon: [
      { url: "/favicon-192.png?v=10", sizes: "192x192", type: "image/png" },
      { url: "/favicon.png?v=10", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg?v=10", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.png?v=10",
    apple: "/apple-touch-icon.png?v=10",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${nunito.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon-192.png?v=10" sizes="192x192" type="image/png" />
        <link rel="icon" href="/favicon.png?v=10" sizes="32x32" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png?v=10" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=10" />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
