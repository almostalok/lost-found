import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: "Lost & Found",
  description: "Report and recover lost items in your community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen bg-neutral-950 text-neutral-100 selection:bg-neutral-800">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
