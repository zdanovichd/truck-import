import brands from "@/json/brands.json";
import products from "@/json/products.json";

export default function sitemap() {
    let sitemap = [
      {
        url: process.env.SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
      },
      {
        url: process.env.SITE_URL + "/catalog",
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.6,
      },
      {
        url: process.env.SITE_URL + "/contacts",
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.2,
      },
      {
        url: process.env.SITE_URL + "/garantii-i-vozvrat",
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.2,
      },
      {
        url: process.env.SITE_URL + "/oplata-i-dostavka",
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.2,
      },
    ];



    brands.forEach((brand) => {
    // 1. Добавляем основную категорию
    sitemap.push({
      url: `${process.env.SITE_URL}/brands/${brand.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // 2. Если есть подкатегории
    if (brand.subcategories?.length) {
      brand.subcategories.forEach((subcategory) => {
        // Добавляем URL подкатегории
        sitemap.push({
          url: `${process.env.SITE_URL}/brands/${brand.slug}/models/${subcategory.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });
    }
  });

      products.map((product, index) => (
        sitemap.push({
            url: process.env.SITE_URL + '/catalog/' + product.sku,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.4,
        })
    ));

    return sitemap;
  }