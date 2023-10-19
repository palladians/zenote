import "@/app/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import { Sidebar } from "@/components/sidebar";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Zenote",
  description: "Tap into a zen feeling with your notes.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} flex flex-row min-h-screen`}>
        <TRPCReactProvider headers={headers()}>
          <Providers>
            <Sidebar />
            <main className="flex flex-[3]">
              {children}
            </main>
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
