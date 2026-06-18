'use client';

import { useCartStore } from '@/store/cart';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';

export default function CartIcon({ title }: { title: string }) {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link href="/cart" className="flex items-center gap-2 hover:text-[var(--color-brand-blue)] transition-colors relative">
      <ShoppingCart size={24} />
      {mounted && totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-[var(--color-brand-orange)] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {totalItems}
        </span>
      )}
      <span className="hidden lg:inline">{title}</span>
    </Link>
  );
}
