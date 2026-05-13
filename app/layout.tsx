import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oopsie",
  description: "Wellness support through every phase of your cycle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}