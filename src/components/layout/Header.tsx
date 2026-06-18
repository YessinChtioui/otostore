import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { User, Search } from 'lucide-react';
import CartIcon from './CartIcon';
import ThemeToggle from '../ThemeToggle';
import SearchBar from './SearchBar';

export default function Header() {
  const t = useTranslations('Navigation');

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="bg-[var(--color-brand-black)] text-white text-sm py-2">
        <div className="container-custom flex justify-between items-center">
          <div>
            <span>Ventes d'accessoires automobile en Tunisie</span>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex gap-2">
              <Link href="/" locale="fr">FR</Link>
              <Link href="/" locale="ar">AR</Link>
              <Link href="/" locale="en">EN</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-4 flex items-center justify-between">
        <Link href="/">
          <div className="relative w-40 h-16 dark:invert dark:opacity-90 transition-all">
            <Image 
              src="/logo.png" 
              alt="OTO STORE" 
              fill 
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-6">
          <ThemeToggle />
          <Link href="/shop" className="font-medium text-gray-800 dark:text-gray-200 hover:text-[var(--color-brand-blue)] dark:hover:text-[var(--color-brand-blue)] transition-colors">
            {t('shop')}
          </Link>
          <Link href="/account" className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-[var(--color-brand-blue)] dark:hover:text-[var(--color-brand-blue)] transition-colors">
            <User size={24} />
            <span className="hidden lg:inline">{t('account')}</span>
          </Link>
          <CartIcon title={t('cart')} />
        </nav>
      </div>
    </header>
  );
}
