'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function SearchBar() {
  const router = useRouter();
  const t = useTranslations('Navigation');
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher..." 
        className="w-full pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:border-[var(--color-brand-blue)] transition-colors"
      />
      <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors">
        <Search size={20} />
      </button>
    </form>
  );
}
