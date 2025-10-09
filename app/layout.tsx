import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display_SC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplaySC = Playfair_Display_SC({
  variable: "--font-playfair-display-sc",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "SafeStays Dashboard",
  description: "Luxury accommodation management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://upload-widget.cloudinary.com/global/all.js"
          type="text/javascript"
          async
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplaySC.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
