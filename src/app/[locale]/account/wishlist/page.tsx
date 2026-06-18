import { auth } from '@/lib/auth';
import { redirect } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { Heart, ArrowLeft, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default async function AccountWishlistPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect({ href: '/auth/login', locale });
  }

  let wishlistProducts: any[] = [];
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: session!.user!.id! },
      include: {
        products: true,
      },
    });
    wishlistProducts = wishlist?.products || [];
  } catch {
    wishlistProducts = [];
  }

  return (
    <main className="bg-gray-50 py-12 min-h-screen">
      <div className="container-custom">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">Mes Favoris</h1>
          {wishlistProducts.length > 0 && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              {wishlistProducts.length} produit{wishlistProducts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product: any) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative aspect-square bg-gray-100">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name?.fr || 'Produit'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingCart size={32} />
                    </div>
                  )}
                  <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm text-red-500 hover:bg-red-50 transition-colors">
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
                <div className="p-4">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-medium text-gray-900 mb-2 hover:text-[var(--color-brand-blue)] transition-colors line-clamp-2">
                      {product.name?.fr || 'Produit'}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg text-[var(--color-brand-blue)]">
                      {formatPrice(product.price)}
                    </p>
                    {product.comparePrice && (
                      <p className="text-sm text-gray-400 line-through">
                        {formatPrice(product.comparePrice)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold mb-2">Votre liste de favoris est vide</h2>
            <p className="text-gray-500 mb-6">Parcourez nos produits et ajoutez vos favoris ici.</p>
            <Link href="/shop" className="btn-primary">
              Découvrir nos produits
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
