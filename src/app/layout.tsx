import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import SmoothScroll from "@/components/layout/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import { SoundProvider } from "@/context/SoundContext";import { WorkSectionProvider } from '@/context/WorkSectionContext';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Iona Takeru — Art Direction & Visual Design",
  description: "Portfolio of Iona Takeru — art direction and visual design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-black">
        <SoundProvider>
          <WorkSectionProvider>
            <CustomCursor />
            <Header />
            <SmoothScroll>{children}</SmoothScroll>
          </WorkSectionProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
