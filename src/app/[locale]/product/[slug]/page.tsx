import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Truck, Shield, RefreshCw } from 'lucide-react';
import ProductActions from '@/components/product/ProductActions';
import ProductGallery from '@/components/product/ProductGallery';
import ProductReviews from '@/components/product/ProductReviews';
import { auth } from '@/lib/auth';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params;
  const session = await auth();

  let product;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: { 
        category: true, 
        reviews: { include: { user: true }, orderBy: { createdAt: 'desc' } } 
      },
    });
  } catch (e) {
    console.log("Database connection failed. Using mock data.");
    product = {
      id: '1', slug, name: { fr: 'Produit Mock' }, description: { fr: 'Description mock' },
      price: 50, images: ['https://res.cloudinary.com/demo/image/upload/v1689255734/cld-sample-5.jpg'], stock: 10,
      category: { name: { fr: 'Mock Cat' }, slug: 'mock' },
      reviews: [],
    } as any;
  }

  if (!product) {
    notFound();
  }

  const name = (product.name as any)?.[locale] || (product.name as any)?.fr;
  const description = (product.description as any)?.[locale] || (product.description as any)?.fr;
  const categoryName = (product.category?.name as any)?.[locale] || (product.category?.name as any)?.fr;

  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : '0.0';
  const reviewCount = product.reviews?.length || 0;

  return (
    <main className="container-custom py-12">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="hover:text-[var(--color-brand-blue)]">Accueil</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <Link href="/shop" className="hover:text-[var(--color-brand-blue)]">Boutique</Link>
            </div>
          </li>
          {product.category && (
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[var(--color-brand-blue)]">
                  {categoryName}
                </Link>
              </div>
            </li>
          )}
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium">{name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-gray-900 p-6 md:p-10 rounded-2xl shadow-sm mb-12 border border-transparent dark:border-gray-800 transition-colors">
        {/* Product Images */}
        <ProductGallery images={product.images} name={name} />

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
              <span className="text-yellow-500 font-bold">★</span>
              <span className="font-medium dark:text-white">{avgRating}</span>
              <span className="text-gray-500 dark:text-gray-400">({reviewCount} avis)</span>
            </div>
            <span className={product.stock > 0 ? "text-green-600 text-sm font-medium flex items-center gap-1" : "text-red-500 text-sm font-medium"}>
              {product.stock > 0 ? (
                <><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> En stock</>
              ) : 'Rupture de stock'}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-4xl font-bold text-[var(--color-brand-blue)]">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 dark:text-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {description}
          </p>

          {/* Interactive Actions (Client Component) */}
          <ProductActions
            product={{
              id: product.id,
              slug: product.slug,
              name,
              price: product.price,
              image: product.images[0] || '/logo.png',
              stock: product.stock,
            }}
          />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Truck className="text-[var(--color-brand-orange)]" size={20} />
              <span>Livraison rapide en Tunisie</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Shield className="text-[var(--color-brand-blue)]" size={20} />
              <span>Paiement à la livraison</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <RefreshCw className="text-[var(--color-brand-blue)]" size={20} />
              <span>Retours acceptés sous 7 jours</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <ProductReviews 
        productId={product.id} 
        initialReviews={product.reviews || []} 
        session={session} 
      />
    </main>
  );
}
