import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oh My Zsh Prompt Builder — Visual Prompt Customizer",
  description:
    "Build and customize your Oh My Zsh prompt visually. Drag-and-drop segments, choose colors and themes, preview in real-time, and export your .zshrc configuration.",
  keywords: [
    "oh my zsh",
    "ohmyzsh",
    "zsh prompt",
    "prompt builder",
    "terminal customization",
    "zshrc generator",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
