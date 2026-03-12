import type { Metadata } from "next";
import { Cinzel, Libre_Baskerville, JetBrains_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import { LangProvider } from "@/context/LangContext";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel-var",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-baskerville-var",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-var",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blood on the Clocktower — Guide Complet",
  description:
    "Guide complet de Blood on the Clocktower : personnages, règles, stratégies, conseils du conteur. Disponible en français et en anglais.",
  keywords: ["blood on the clocktower", "BOTC", "guide", "wiki", "jeu"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cinzel.variable} ${libreBaskerville.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <LangProvider>
          <Navigation />
          <main>{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
