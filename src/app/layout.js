import { gilroy } from './fonts'
import "./globals.css";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: "Truck Import",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={`${gilroy.variable}`}>

        <Header />
        {children}
        <Footer />
        <SpeedInsights/>
        <Analytics/>
      </body>
    </html>
  );
}
