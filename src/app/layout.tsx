import type { Metadata } from "next";
import { Josefin_Sans, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-josefin",
});

export const metadata: Metadata = {
  title: "Energy Track",
  description: "Registro y seguimiento de sistemas fotovoltaicos instalados por TEC Energy Solutions.",
  icons: {
    icon: "/ICONOS/NARANJA.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${josefin.variable}`}>
      <body>{children}</body>
    </html>
  );
}
