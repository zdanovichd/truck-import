// import Image from "next/image";
import styles from "./page.module.css";
import brands from './data.json';
import { notFound } from "next/navigation";
import SectionTitle from "@/app/components/ui/SectionTitle/SectionTitle";
import Image from "next/image";
import Link from 'next/link';

export const dynamicParams = false;

export async function generateStaticParams() {
  return brands.map((brand) => ({
    slug: brand.slug, // Ключ должен совпадать с именем папки [slug]
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const brand = brands.find(brand => brand.slug === slug);

  return {
    title: brand?.title || 'Default Title',
    description: brand?.description || 'Default Description',
  };
}

export default async function Page({ params }) {
  // Находим бренд по slug из параметров URL
  const { slug } = await params
  const brand = brands.find(brand => brand.slug === slug);
  const subcategories = brand.subcategories;
  console.log(subcategories);
  if (!brand) {
    notFound();
  }

  return (
    <main>
      <section className={styles.category__hero}>
        <h1 className={styles.category__title}>Запчасти для грузовиков {brand.name}</h1>
      </section>
      <section className={styles.subcategories}>
        <SectionTitle
          title="Модельный ряд грузовиков Mercedes-Benz"
          align="left"
        />
            <div className={styles.subcategories__inner}>
              {subcategories.map((item, index) => (
                <Link
                  key={index}
                  href={`/catalog/${brand.slug}/${item.slug}`}
                  className={styles.subcategory}
                  >
                  <Image
                    className={styles.subcategory__image}
                    // src={`/categories/${brand.slug}/${item.slug}/${brand.slug}-${item.slug}.png`}
                    src={'/7_0.jpg'}
                    alt={`${brand.name} ${item.name}`}
                    width={500} // дефолтное значение (для SSR)
                    height={300}
                    style={{
                      width: 'calc(353vw/14.4)',
                      height: 'calc(350vw/14.4)',
                      objectFit: 'cover',
                    }}
                  />
                  <p className={styles.subcategory__name}>Запчасти {brand.name} {item.name}</p>
              </Link>
              ))}
            </div>
      </section>
    </main>
  );
}