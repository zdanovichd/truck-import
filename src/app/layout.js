import { gilroy } from './fonts'
import "./globals.css";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import Image from "next/image";

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
      </body>
    </html>
  );
}
