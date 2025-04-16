export default function sitemap() {
    return [
      {
        url: `${process.env.SITE_URL}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
      },
    ]
  }