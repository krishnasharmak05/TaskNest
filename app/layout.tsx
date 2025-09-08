"use client"

import { SessionProvider } from "next-auth/react"
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body
          className={`${inter.className}`}
        >
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
