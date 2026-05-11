import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zhiin CMS | Admin Portal",
  description: "Next-generation content management system",
};

import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ToastProvider>
            <SettingsProvider>
              {children}
            </SettingsProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
