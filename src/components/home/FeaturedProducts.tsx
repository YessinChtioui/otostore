import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { formatPrice } from '@/lib/utils';
import QuickAddButton from '@/components/product/QuickAddButton';

export default function FeaturedProducts({ products, locale }: { products: any[], locale: string }) {
  const t = useTranslations('Common');

  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 bg-[var(--color-brand-gray)] dark:bg-gray-950 transition-colors">
      <div className="container-custom">
        <h2 className="h2 mb-10 text-center">Produits Vedettes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const name = product.name?.[locale] || product.name?.fr || 'Produit';
            const img = product.images?.[0] || '/logo.png';

            return (
              <div key={product.id} className="bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group flex flex-col">
                <Link href={`/product/${product.slug}`} className="relative h-64 w-full block overflow-hidden bg-gray-50 dark:bg-gray-800">
                  <Image
                    src={img}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.comparePrice && (
                    <div className="absolute top-3 left-3 bg-[var(--color-brand-orange)] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                      PROMO
                    </div>
                  )}
                </Link>
                <div className="p-5 flex flex-col flex-grow">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-bold text-lg mb-2 hover:text-[var(--color-brand-blue)] transition-colors line-clamp-2">{name}</h3>
                  </Link>
                  <div className="mt-auto pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-[var(--color-brand-blue)]">{formatPrice(product.price)}</span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                      )}
                    </div>
                    <QuickAddButton product={{
                      id: product.id,
                      slug: product.slug,
                      name,
                      price: product.price,
                      image: img,
                      stock: product.stock,
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
