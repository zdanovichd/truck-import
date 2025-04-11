// import Image from "next/image";
import styles from "./page.module.css";
import brands from './../data.json';
import { notFound } from "next/navigation";

export const dynamicParams = false;

// export async function generateStaticParams() {
//   return brands.map((brand) => ({
//     sub: brand.subcategories.slug, // Ключ должен совпадать с именем папки [slug]
//   }));
// }

export async function generateMetadata({ params }) {
  const { slug, sub } = await params
  const brand = brands.find(brand => brand.slug === slug);
  const subcategories = brand.subcategories;
  const subcategory = subcategories.find(subcategory => subcategory.slug === sub);

  return {
    title: subcategory?.title || 'Default Title',
    description: subcategory?.description || 'Default Description',
  };
}

export default async function Page({ params }) {
  const { slug, sub } = await params
  console.log(sub)
  const brand = brands.find(brand => brand.slug === slug);
  const subcategories = brand.subcategories;
  const subcategory = subcategories.find(subcategory => subcategory.slug === sub);


    if (!subcategory) {
      notFound();
    }

  return (
    <main>
      <section className={styles.category__hero}>
        <h1 className={styles.category__title}>{subcategory.h1}</h1>
      </section>
    </main>
  );
}