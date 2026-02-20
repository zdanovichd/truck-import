'use server';
import services from '@/json/services.json';
import brands from '@/json/brands.json';
import { notFound } from 'next/navigation';
import ClientPage from '@/components/ui/ClientPage/ClientPage';

// export async function generateMetadata(props) {

//   const { params } = await props;
//   const { slug, sub } = params;

//     return {
//       title: 'Каталог (вид детали) для (марка грузовика) - купить в интернет-магазине Truck-import',
//       description: 'Широкий выбор (вид детали) для (марка автомобиля) в каталоге интернет-магазина Truck-import. Качественные запчасти, выгодные цены, доставка по всей России. Купить (вид детали) для (марка автомобиля) — быстро и надежно!',
//     };
// }

export default async function Page({ params }) {
  const { slug, sub } = params;


  // const brands = data.brands;
  const service = services.find((s) => s.slug === sub);
  const brand = brands.find((b) => b.slug === slug);

  if (!brand || !service) notFound();
  if (brand.h1 === 'h1') {
    notFound();
  }

  return <ClientPage brand={brand} service={service} />;
}
