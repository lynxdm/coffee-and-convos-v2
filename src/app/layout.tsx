import type { Metadata } from "next";
import "./globals.css";
import AppProvider from "./AppContext";

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
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
