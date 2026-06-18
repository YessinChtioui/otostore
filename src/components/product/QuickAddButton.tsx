'use client';

import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/Button';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface QuickAddButtonProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
  variant?: 'primary' | 'ghost' | 'icon';
}

export default function QuickAddButton({ product, variant = 'primary' }: QuickAddButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product link if wrapped
    if (product.stock <= 0) return;

    addItem({
      id: product.id,
      productId: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: 1,
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (variant === 'icon') {
    return (
      <button 
        onClick={handleAdd}
        disabled={product.stock <= 0}
        className="text-[var(--color-brand-blue)] hover:text-blue-700 font-medium text-sm disabled:opacity-50"
      >
        {added ? '✓ Ajouté' : '+ Ajouter'}
      </button>
    );
  }

  return (
    <Button 
      onClick={handleAdd} 
      disabled={product.stock <= 0}
      className="w-full font-bold flex gap-2 justify-center"
    >
      <ShoppingCart size={18} />
      {added ? 'Ajouté !' : 'Ajouter au panier'}
    </Button>
  );
}
