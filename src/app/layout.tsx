import type { Metadata } from "next";
import "./globals.css";
import AppProvider from "./contexts/AppContext";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import WarningModalProvider from "./contexts/WarningModalContext";

export const metadata: Metadata = {
  title: "Coffee & Convos",
  description: "A personal blog by the betawriter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='font-overpass text-primary'>
        <AppProvider>
          <WarningModalProvider>
            <Navbar bg='' />
            <Toaster richColors position='top-right' />
            {children}
          </WarningModalProvider>
        </AppProvider>
      </body>
    </html>
  );
}
