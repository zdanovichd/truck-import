// import Image from "next/image";
import styles from "./page.module.css";
import data from './data.json';
import { notFound } from "next/navigation";
import SectionTitle from "@/app/components/ui/SectionTitle/SectionTitle";
import Image from "next/image";
import Link from 'next/link';
import Reviews from "@/app/components/ui/Reviews/Reviews";
import Search from "@/app/components/ui/Search/Search";
import Faq from "@/app/components/sections/Faq/Faq";
import Feedback from "@/app/components/ui/Feedback/Feedback";
import Category from "./components/Category/Category";
import Product from "./components/Product/Product";

export const dynamicParams = false;

export async function generateStaticParams() {
  const brands = data.brands;
  const products = data.products;
  const brands_slugs = brands.map(brand => brand.slug);
  // console.log(all_slugs)
  const product_slugs = products.map(product => product.sku);
  const all_slugs = [...brands_slugs, ...product_slugs];
  // all_slugs.push(product_slugs);

  return all_slugs.map((slug) => ({
    slug: slug, // Ключ должен совпадать с именем папки [slug]
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const brands = data.brands;
  const products = data.products;

  const brand = brands.find(brand => brand.slug === slug);
  const product = products.find(product => product.sku === slug);
  if (brand) {
    return {
      title: brand?.meta__title || 'Default Title',
      description: brand?.meta__description || 'Default Description',
    };
  } else if (product) {
    return {
      title: product?.meta__title || 'Default Title',
      description: product?.meta__description || 'Default Description',
    };
  }
}

export default async function Page({ params }) {
  // Находим бренд по slug из параметров URL
  const { slug } = await params
  const brands = data.brands;
  const products = data.products;

  const brand = brands.find(brand => brand.slug === slug);
  const product = products.find(product => product.sku === slug);


  // console.log(first__place);
  // if (!brand) {
  //   notFound();
  // }

  return ( <>
    {brand ? (
      <Category brand={brand} />
    ) : (
      <Product product={product} />
    )}
  </>
  );
}