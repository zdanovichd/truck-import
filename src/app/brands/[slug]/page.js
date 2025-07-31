// 'use client';
import styles from "./page.module.css";
import brands from '@/json/brands.json';
import Category from "@/components/ui/Category/Category";

export const dynamicParams = false;

export async function generateStaticParams() {
  // const brands = data.brands;

  const brands_slugs = brands.map(brand => brand.slug);

  return brands_slugs.map((slug) => ({
    slug: slug, // Ключ должен совпадать с именем папки [slug]
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  // const brands = data.brands;

  const brand = brands.find(brand => brand.slug === slug);
  if (brand) {
    return {
      title: brand?.meta__title || 'Default Title',
      description: brand?.meta__description || 'Default Description',
    };
  }
}

export default async function Page({ params }) {
  // Находим бренд по slug из параметров URL
  const { slug } = await params
  // const brands = data.brands;

  const brand = brands.find(brand => brand.slug === slug);

  return ( <>
    {brand &&
      <Category brand={brand} />
    }
  </>
  );
}