import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "Paroki Brayut",
  description: "Website Resmi Paroki Brayut - Santo Yohanes Paulus II",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${rubik.variable} font-rubik bg-brand-cream text-brand-dark antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
