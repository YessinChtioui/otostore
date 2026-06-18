import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://otostore.tn'

  // Get all products
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      select: { slug: true, updatedAt: true },
    })
  } catch (e) {
    products = []
  }

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/fr/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const staticUrls = [
    {
      url: `${baseUrl}/fr`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/fr/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fr/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  return [...staticUrls, ...productUrls]
}
