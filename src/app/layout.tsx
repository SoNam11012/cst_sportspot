import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Dynamically import Bootstrap JS on client side
if (typeof window !== "undefined") {
  import("bootstrap/dist/js/bootstrap.bundle.min.js");
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CST SportSpot",
  description: "Campus Sports Venue Booking System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
