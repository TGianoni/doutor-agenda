import "./globals.css";

import type { Metadata } from "next";
import { Manrope } from "next/font/google"; // Ajuste se usar outra fonte
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { Toaster } from "sonner";

import { ReactQueryProvider } from "@/providers/react-query"; // Ajuste o caminho se necessário

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Doutor Agenda",
  description: "Sistema de agendamento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} antialiased`}>
        <ReactQueryProvider>
          {/* O Suspense é obrigatório para o NuqsAdapter no Next 15 */}
          <Suspense fallback={null}>
            <NuqsAdapter>{children}</NuqsAdapter>
          </Suspense>
        </ReactQueryProvider>

        <Toaster position="bottom-center" richColors theme="light" />
      </body>
    </html>
  );
}
