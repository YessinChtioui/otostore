'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';

interface Category {
  id: string;
  slug: string;
  name: any;
}

export default function ShopFilters({ categories, currentCategory, currentPrice }: {
  categories: Category[];
  currentCategory?: string;
  currentPrice?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/shop');
  };

  const hasActiveFilters = currentCategory || currentPrice;

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm sticky top-24 border border-transparent dark:border-gray-800 transition-colors">
      <div className="flex items-center justify-between font-bold text-lg mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-2 dark:text-white">
          <Filter size={20} />
          <span>Filtres</span>
        </div>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <X size={14} /> Effacer
          </button>
        )}
      </div>
      
      {/* Category Filter */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4 dark:text-white">Catégories</h3>
        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <li>
            <button 
              onClick={() => updateFilter('category', null)}
              className={`hover:text-[var(--color-brand-blue)] transition-colors text-left w-full ${!currentCategory ? 'text-[var(--color-brand-blue)] font-bold' : ''}`}
            >
              Toutes les catégories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button 
                onClick={() => updateFilter('category', cat.slug)}
                className={`hover:text-[var(--color-brand-blue)] transition-colors text-left w-full ${currentCategory === cat.slug ? 'text-[var(--color-brand-blue)] font-bold' : ''}`}
              >
                {cat.name?.fr || cat.slug}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Price Filter */}
      <div>
        <h3 className="font-semibold mb-4 dark:text-white">Prix</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <label className="flex items-center gap-2 cursor-pointer hover:text-black dark:hover:text-white transition-colors">
            <input 
              type="radio" 
              name="price" 
              checked={currentPrice === 'under50'}
              onChange={() => updateFilter('price', currentPrice === 'under50' ? null : 'under50')}
              className="accent-[var(--color-brand-blue)]"
            /> 
            Moins de 50 TND
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-black dark:hover:text-white transition-colors">
            <input 
              type="radio" 
              name="price" 
              checked={currentPrice === '50to100'}
              onChange={() => updateFilter('price', currentPrice === '50to100' ? null : '50to100')}
              className="accent-[var(--color-brand-blue)]"
            /> 
            50 - 100 TND
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-black dark:hover:text-white transition-colors">
            <input 
              type="radio" 
              name="price" 
              checked={currentPrice === 'over100'}
              onChange={() => updateFilter('price', currentPrice === 'over100' ? null : 'over100')}
              className="accent-[var(--color-brand-blue)]"
            /> 
            Plus de 100 TND
          </label>
        </div>
      </div>
    </div>
  );
}
