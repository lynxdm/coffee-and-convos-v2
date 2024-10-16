import type { Metadata } from "next";
import "./globals.css";
import AppProvider from "./contexts/AppContext";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import WarningModalProvider from "./contexts/WarningModalContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://coffee-and-convos.vercel.app"),
  title: {
    default: "Coffee & Convos",
    template: `%s - Coffee & Convos`,
  },
  description: "Adefunke's blog",
  creator: "Adesegun Adefunke",
  verification: {
    google: "rMB-vY4K9xQw-VKT8BS4DkKUJt1HvbTc9_VN6oRVtZg",
  },
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
          <Analytics />
        </body>
      </AppProvider>
    </html>
  );
}
