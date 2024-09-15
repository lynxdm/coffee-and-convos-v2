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
      <AppProvider>
        <body className='dark:text-darkPrimary dark:bg-darkBg  bg-white font-overpass text-primary min-h-[100vh]'>
          <WarningModalProvider>
            <Navbar bg='' />
            <Toaster richColors position='top-right' />
            {children}
          </WarningModalProvider>
        </body>
      </AppProvider>
    </html>
  );
}
