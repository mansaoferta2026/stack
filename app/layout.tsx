import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "MansaOferta.com.ar",
  description: "Conectando Pymes con consumidores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-50">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
