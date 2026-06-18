'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Trash2, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const t = useTranslations('Cart');
  const tCommon = useTranslations('Common');
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="container-custom py-12 min-h-[50vh]">Loading...</div>;

  if (items.length === 0) {
    return (
      <main className="container-custom py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6 transition-colors">
          <Trash2 size={48} className="text-gray-400 dark:text-gray-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4 dark:text-white">{t('title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{t('empty')}</p>
        <Link href="/shop" className="btn-primary">
          Continuer mes achats
        </Link>
      </main>
    );
  }

  return (
    <main className="container-custom py-12 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-transparent dark:border-gray-800 transition-colors">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 font-semibold text-sm text-gray-500 dark:text-gray-400">
              <div className="col-span-6">Produit</div>
              <div className="col-span-2 text-center">Prix</div>
              <div className="col-span-2 text-center">Quantité</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.map((item) => (
                <div key={item.id} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>

                  {/* Product Info */}
                  <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <Link href={`/product/${item.productId}`} className="font-bold text-gray-900 dark:text-gray-100 hover:text-[var(--color-brand-blue)] transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-1 md:col-span-2 text-left md:text-center font-medium mt-2 md:mt-0 dark:text-gray-300">
                    <span className="md:hidden text-gray-500 dark:text-gray-400 mr-2 text-sm">Prix:</span>
                    {formatPrice(item.price)}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-center mt-2 md:mt-0">
                    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                      >-</button>
                      <span className="w-8 text-center font-medium text-sm dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                      >+</button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end mt-2 md:mt-0">
                    <span className="md:hidden text-gray-500 mr-2 text-sm">Total:</span>
                    <span className="font-bold text-[var(--color-brand-blue)] mr-4">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="hidden md:block text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm sticky top-24 border border-transparent dark:border-gray-800 transition-colors">
            <h2 className="text-lg font-bold mb-6 pb-4 border-b border-gray-100 dark:border-gray-800 dark:text-white">Résumé de la commande</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Sous-total</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Livraison</span>
                <span className="font-medium text-gray-900 dark:text-white">Calculé à l'étape suivante</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-900 dark:text-white">Total estimé</span>
                <span className="text-2xl font-bold text-[var(--color-brand-blue)]">{formatPrice(totalPrice())}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 text-right">Taxes incluses</p>
            </div>
            
            <Link href="/checkout" className="w-full btn-primary font-bold flex justify-center items-center gap-2 shadow-lg shadow-orange-500/30">
              {t('checkout')}
              <ArrowRight size={18} />
            </Link>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>Paiement à la livraison uniquement</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
