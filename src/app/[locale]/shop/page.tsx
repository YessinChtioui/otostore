import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import QuickAddButton from '@/components/product/QuickAddButton';
import prisma from '@/lib/prisma';
import ShopFilters from '@/components/shop/ShopFilters';
import ShopSort from '@/components/shop/ShopSort';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const categorySlug = params.category as string | undefined;
  const q = params.q as string | undefined;
  const priceFilter = params.price as string | undefined;
  const sortBy = params.sort as string | undefined;

  // Build the where clause
  let whereClause: any = {};
  
  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }

  // Price filter in Prisma query
  if (priceFilter === 'under50') {
    whereClause.price = { lt: 50 };
  } else if (priceFilter === '50to100') {
    whereClause.price = { gte: 50, lte: 100 };
  } else if (priceFilter === 'over100') {
    whereClause.price = { gt: 100 };
  }

  // Sort order
  let orderByClause: any = { createdAt: 'desc' };
  if (sortBy === 'price_asc') {
    orderByClause = { price: 'asc' };
  } else if (sortBy === 'price_desc') {
    orderByClause = { price: 'desc' };
  } else if (sortBy === 'newest') {
    orderByClause = { createdAt: 'desc' };
  }

  let products: any[] = [];
  let categories: any[] = [];
  
  try {
    categories = await prisma.category.findMany();
    products = await prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: orderByClause,
    });
    
    // Text search filter (in-memory because Prisma JSON search is complex)
    if (q) {
      const lowercaseQ = q.toLowerCase();
      products = products.filter(p => {
        const nameFr = (p.name as any)?.fr?.toLowerCase() || '';
        const nameAr = (p.name as any)?.ar?.toLowerCase() || '';
        const nameEn = (p.name as any)?.en?.toLowerCase() || '';
        return nameFr.includes(lowercaseQ) || nameAr.includes(lowercaseQ) || nameEn.includes(lowercaseQ);
      });
    }
  } catch (e) {
    console.log("Database connection failed. Using mock data.");
    products = [
      { id: '1', slug: 'produit-1', name: { fr: 'Produit Test' }, price: 50, images: ['https://res.cloudinary.com/demo/image/upload/v1689255734/cld-sample-5.jpg'] }
    ] as any;
  }

  // Active filters summary
  const activeFilterCount = [categorySlug, priceFilter, q].filter(Boolean).length;

  return (
    <main className="container-custom py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <ShopFilters 
            categories={categories} 
            currentCategory={categorySlug} 
            currentPrice={priceFilter} 
          />
        </aside>
        
        {/* Product Grid */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm mb-6 gap-4 border border-transparent dark:border-gray-800 transition-colors">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Affichage de <span className="font-bold text-black dark:text-white">{products.length}</span> résultats
              {q && (
                <span> pour &ldquo;<span className="font-semibold text-[var(--color-brand-blue)]">{q}</span>&rdquo;</span>
              )}
              {activeFilterCount > 0 && (
                <Link href="/shop" className="ml-2 text-red-500 hover:text-red-600 text-xs font-medium transition-colors">
                  (Effacer les filtres)
                </Link>
              )}
            </p>
            
            <div className="flex items-center gap-4">
              <ShopSort currentSort={sortBy} />
            </div>
          </div>
          
          {/* Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <div key={product.id} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-transparent dark:border-gray-800 group flex flex-col">
                  <Link href={`/product/${product.slug}`} className="relative h-64 w-full block overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                    <Image
                      src={product.images[0] || '/logo.png'}
                      alt={(product.name as any)?.fr || 'Product'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.comparePrice && (
                      <div className="absolute top-3 left-3 bg-[var(--color-brand-orange)] text-white text-xs font-bold px-3 py-1 rounded-full">
                        PROMO
                      </div>
                    )}
                  </Link>
                  <div className="p-5 flex flex-col flex-grow">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-bold text-lg mb-2 hover:text-[var(--color-brand-blue)] dark:text-gray-100 transition-colors line-clamp-2">
                        {(product.name as any)?.fr || 'Produit'}
                      </h3>
                    </Link>
                    {product.category && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                        {(product.category.name as any)?.fr || ''}
                      </p>
                    )}
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-[var(--color-brand-blue)]">{formatPrice(product.price)}</span>
                        {product.comparePrice && (
                          <span className="text-sm text-gray-400 dark:text-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
                        )}
                      </div>
                      <QuickAddButton product={{
                        id: product.id,
                        slug: product.slug,
                        name: (product.name as any)?.fr || 'Produit',
                        price: product.price,
                        image: product.images?.[0] || '/logo.png',
                        stock: product.stock,
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 p-12 rounded-xl shadow-sm text-center border border-transparent dark:border-gray-800 transition-colors">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Aucun produit trouvé</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Essayez de modifier vos filtres ou votre recherche.</p>
              <Link href="/shop" className="btn-primary">
                Effacer les filtres
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
