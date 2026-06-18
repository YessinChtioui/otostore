import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import HomeCategories from '@/components/home/HomeCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BestSellers from '@/components/home/BestSellers';
import CustomerReviews from '@/components/home/CustomerReviews';
import Newsletter from '@/components/home/Newsletter';
import prisma from '@/lib/prisma';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Fetch real products from DB
  const [featured, bestSellers] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      take: 4,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.findMany({
      where: { bestSeller: true },
      take: 4,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  // Fallback if no products are marked as featured/bestseller yet
  let finalFeatured = featured;
  let finalBestSellers = bestSellers;

  if (featured.length === 0 || bestSellers.length === 0) {
    const allProducts = await prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' }
    });
    if (featured.length === 0) finalFeatured = allProducts.slice(0, 4);
    if (bestSellers.length === 0) finalBestSellers = allProducts.slice(4, 8);
  }

  return (
    <main>
      <section className="bg-[var(--color-brand-blue)] py-24 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-[var(--color-brand-orange)] blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-sm font-semibold mb-6 tracking-wider">
              100% TUNISIEN
            </span>
            <h1 className="h1 mb-6 leading-tight">
              Trouvez les Meilleurs Accessoires pour Votre Voiture
            </h1>
            <p className="text-xl mb-10 opacity-90 max-w-lg">
              Qualité premium, prix imbattables et paiement à la livraison partout en Tunisie.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/shop" 
                className="btn-primary text-lg px-8 shadow-lg shadow-orange-500/30"
              >
                Découvrir la Boutique
              </Link>
              <Link 
                href="/shop?sort=best-sellers" 
                className="btn-outline text-lg px-8 border-transparent bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                Meilleures Ventes
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <HomeCategories />
      <BestSellers products={finalBestSellers} locale={locale} />
      <FeaturedProducts products={finalFeatured} locale={locale} />
      <CustomerReviews />
      <Newsletter />
    </main>
  );
}
