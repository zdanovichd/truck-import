export default function robots() {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${process.env.SITE_URL}/sitemap.xml`,
    }
  }