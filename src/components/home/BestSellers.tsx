import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { formatPrice } from '@/lib/utils';
import QuickAddButton from '@/components/product/QuickAddButton';

export default function BestSellers({ products, locale }: { products: any[], locale: string }) {
  const t = useTranslations('Common');

  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
      <div className="container-custom">
        <h2 className="h2 mb-10 text-center">Nos Meilleures Ventes</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const name = product.name?.[locale] || product.name?.fr || 'Produit';
            const img = product.images?.[0] || '/logo.png';

            return (
              <div key={product.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:shadow-lg transition-shadow flex flex-col group bg-white dark:bg-gray-800/50">
                <Link href={`/product/${product.slug}`} className="relative h-48 w-full block mb-4 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                  <Image
                    src={img}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 hover:text-[var(--color-brand-blue)] transition-colors line-clamp-1">{name}</h3>
                </Link>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-[var(--color-brand-orange)]">{formatPrice(product.price)}</span>
                  <QuickAddButton 
                    variant="icon"
                    product={{
                      id: product.id,
                      slug: product.slug,
                      name,
                      price: product.price,
                      image: img,
                      stock: product.stock,
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
