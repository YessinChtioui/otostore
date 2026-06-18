import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('Navigation');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-brand-black)] text-white pt-12 pb-8">
      <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-[var(--color-brand-blue)]">OTO STORE</h3>
          <p className="text-gray-400 text-sm mb-4">
            Ventes d'accessoires automobile de haute qualité en Tunisie.
            Paiement à la livraison garanti.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-[var(--color-brand-orange)]">Liens Rapides</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-white transition-colors">{t('home')}</Link></li>
            <li><Link href="/shop" className="hover:text-white transition-colors">{t('shop')}</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">{t('cart')}</Link></li>
            <li><Link href="/account" className="hover:text-white transition-colors">{t('account')}</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-[var(--color-brand-orange)]">Catégories</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/shop?category=supports-telephone" className="hover:text-white transition-colors">Supports Téléphone</Link></li>
            <li><Link href="/shop?category=housses-siege" className="hover:text-white transition-colors">Housses de Siège</Link></li>
            <li><Link href="/shop?category=tapis-sol" className="hover:text-white transition-colors">Tapis de Sol</Link></li>
            <li><Link href="/shop?category=eclairage-led" className="hover:text-white transition-colors">Éclairage LED</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-[var(--color-brand-orange)]">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Email: contact@otostore.tn</li>
            <li>Tél: +216 55 000 000</li>
            <li>Adresse: Tunis, Tunisie</li>
          </ul>
        </div>
      </div>
      
      <div className="container-custom border-t border-gray-800 pt-8 mt-8 text-center text-sm text-gray-500">
        <p>&copy; {currentYear} OTO STORE. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
