export default function robots() {

    if (process.env.SITE_URL === "https://truck-import.ru") {
        return {
            rules: {
            userAgent: '*',
            allow: '/',
            cleanParam: 's&page&model&brand&part&limit&sortBy&sortOrder'
            },
            sitemap: process.env.SITE_URL + '/sitemap.xml',
        }
    } else {
        return {
            rules: {
            userAgent: '*',
            disallow: '/'
            },
            sitemap: process.env.SITE_URL + '/sitemap.xml',
        }
    }
}