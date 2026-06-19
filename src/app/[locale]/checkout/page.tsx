'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const t = useTranslations('Checkout');
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', governorate: '', city: '', address: '', postalCode: '', notes: ''
  });

  const governorates = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan",
    "Kasserine", "Kébili", "Le Kef", "Mahdia", "La Manouba", "Médenine", "Monastir", "Nabeul",
    "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to cart if empty (in useEffect to avoid setState during render)
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart');
    }
  }, [mounted, items.length, router]);

  if (!mounted || items.length === 0) return null;

  const shippingCost = 7.000; // 7 TND flat rate delivery
  const finalTotal = totalPrice() + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
          total: finalTotal,
          deliveryInfo: formData,
          notes: formData.notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur serveur');
      }

      const { orderNumber } = await res.json();
      
      // Success! Clear cart and redirect
      clearCart();
      router.push('/checkout/success?orderNumber=' + orderNumber);
      
    } catch (error: any) {
      console.error('Error placing order', error);
      alert(error.message || 'Une erreur est survenue lors de la commande.');
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-950 transition-colors py-12 min-h-screen">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">{t('title')}</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100 dark:border-gray-800 dark:text-white">Informations de livraison</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('fullName')} *</label>
                  <Input name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('phone')} *</label>
                  <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('email')} (pour le suivi)</label>
                  <Input name="email" type="email" value={formData.email} onChange={handleInputChange} />
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-4 mt-8 dark:text-white">Adresse de livraison</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('governorate')} *</label>
                  <select 
                    name="governorate" 
                    value={formData.governorate} 
                    onChange={handleInputChange} 
                    required
                    className="flex h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition-colors"
                  >
                    <option value="">Sélectionnez un gouvernorat</option>
                    {governorates.map(gov => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('city')} *</label>
                  <Input name="city" value={formData.city} onChange={handleInputChange} required className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('address')} *</label>
                  <Input name="address" value={formData.address} onChange={handleInputChange} required placeholder="Numéro de rue, nom du bâtiment, etc." className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('postalCode')} *</label>
                  <Input name="postalCode" value={formData.postalCode} onChange={handleInputChange} required className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('notes')}</label>
                <textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent min-h-[100px] transition-colors"
                  placeholder="Instructions spéciales pour le livreur (optionnel)"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 p-4 rounded-lg flex items-start gap-3 mb-8 transition-colors">
                <div className="mt-0.5 text-[var(--color-brand-blue)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1">Paiement 100% sécurisé</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-400">Vous ne payez rien maintenant. Le paiement se fait en espèces (Cash on Delivery) uniquement lorsque vous recevez votre commande en main propre.</p>
                </div>
              </div>

              <Button type="submit" className="w-full text-lg h-14 font-bold shadow-lg shadow-orange-500/30" disabled={isSubmitting}>
                {isSubmitting ? 'Traitement en cours...' : t('placeOrder')}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24 transition-colors">
              <h2 className="text-lg font-bold mb-6 pb-4 border-b border-gray-100 dark:border-gray-800 dark:text-white">Résumé ({items.length} articles)</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="relative w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                      <span className="absolute -top-2 -right-2 bg-gray-500 dark:bg-gray-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">{item.name}</h4>
                      <p className="text-[var(--color-brand-blue)] font-bold mt-1 text-sm">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                  <span>Sous-total</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                  <span>Frais de livraison</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatPrice(shippingCost)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-900 dark:text-white text-lg">Total à payer</span>
                  <span className="text-2xl font-bold text-[var(--color-brand-orange)]">{formatPrice(finalTotal)}</span>
                </div>
                <p className="text-xs text-center text-gray-500 mt-4">En confirmant, vous vous engagez à payer ce montant au livreur.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
