'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

export default function ShopSort({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;
    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select 
      value={currentSort || ''}
      onChange={handleSortChange}
      className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md text-sm px-3 py-2 focus:ring-[var(--color-brand-blue)] focus:outline-none transition-colors cursor-pointer"
    >
      <option value="">Trier par défaut</option>
      <option value="price_asc">Prix croissant</option>
      <option value="price_desc">Prix décroissant</option>
      <option value="newest">Nouveautés</option>
    </select>
  );
}
