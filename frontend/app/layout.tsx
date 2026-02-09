import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";


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
        <Providers>
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
