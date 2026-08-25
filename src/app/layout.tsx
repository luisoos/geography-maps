import type { Metadata } from "next";
import { Iosevka_Charon_Mono, Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const iosevkaCharonMono = Iosevka_Charon_Mono({
  weight: ["300", "400", "500", "700"],
  variable: "--font-iosevka-charon-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Geografiekarten",
  description: "Eine Sammlung von Geografiekarten",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${lora.variable} ${iosevkaCharonMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col max-w-[97.5%] pt-32 xl:max-w-xl mx-auto">
        {children}
      </body>
    </html>
  );
}
