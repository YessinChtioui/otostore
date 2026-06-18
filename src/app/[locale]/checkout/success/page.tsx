'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OrderSuccessPage() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'OTO-XXXXXX';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="bg-gray-50 dark:bg-gray-950 transition-colors py-24 min-h-screen flex items-center justify-center">
      <div className="container-custom max-w-2xl text-center">
        <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
            <CheckCircle size={48} strokeWidth={2.5} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Commande Confirmée !</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Merci pour votre confiance. Votre commande a été enregistrée avec succès.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800 inline-block text-left mb-10 w-full sm:w-auto min-w-[300px] transition-colors">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Numéro de commande</p>
            <p className="text-2xl font-mono font-bold text-[var(--color-brand-blue)] mb-4">{orderNumber}</p>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Mode de paiement</p>
            <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-orange)]"></span>
              Paiement à la livraison
            </p>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 max-w-md mx-auto">
            Nous vous contacterons très prochainement pour confirmer la date de livraison. Un email récapitulatif vous a été envoyé.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/account/orders" className="btn-outline">
              Suivre ma commande
            </Link>
            <Link href="/shop" className="btn-primary">
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
