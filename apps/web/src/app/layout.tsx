import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { CommerceProvider } from '@/context/CommerceContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zhiin CMS | Modern Content Architecture',
  description: 'A professional-grade CMS for modern enterprises.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <ToastProvider>
            <SettingsProvider>
              <CommerceProvider>
                {children}
              </CommerceProvider>
            </SettingsProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
