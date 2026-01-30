import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";


export const metadata: Metadata = {
  title: "Money Manager",
  description: "Manage your money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
