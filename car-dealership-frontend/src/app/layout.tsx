import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cars Dealership",
  description: "----",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${jetbrainsMono.className} flex min-h-dvh flex-col antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <nav className="h-4 bg-white text-black">navbar</nav>
        <main className="container mx-auto my-5 flex flex-1 px-4">
          {children}
        </main>
        <footer className="h-4 bg-white text-black">footer</footer>
      </body>
    </html>
  );
}
