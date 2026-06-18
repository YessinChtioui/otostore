'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { ShoppingCart, Heart, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProductActionsProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => Math.min(product.stock, q + 1));

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async () => {
    setWishlistLoading(true);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.ok) {
        setWishlistAdded(true);
      } else if (res.status === 401) {
        alert('Veuillez vous connecter pour ajouter aux favoris');
      }
    } catch {
      // ignore
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Quantity selector */}
      <div className="flex items-center border border-gray-300 rounded-md w-32">
        <button onClick={decrease} className="px-4 py-3 hover:bg-gray-50 text-gray-600 transition-colors">
          -
        </button>
        <span className="w-full text-center font-medium">{quantity}</span>
        <button onClick={increase} className="px-4 py-3 hover:bg-gray-50 text-gray-600 transition-colors">
          +
        </button>
      </div>

      {/* Add to cart */}
      <Button
        size="lg"
        className="flex-1 flex gap-2 text-lg font-bold shadow-lg shadow-orange-500/30"
        disabled={product.stock === 0}
        onClick={handleAddToCart}
      >
        {added ? (
          <>
            <Check size={20} /> Ajouté !
          </>
        ) : (
          <>
            <ShoppingCart size={20} /> Ajouter au panier
          </>
        )}
      </Button>

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        disabled={wishlistLoading}
        className={`p-4 border rounded-md transition-colors flex-shrink-0 ${
          wishlistAdded
            ? 'border-red-300 bg-red-50 text-red-500'
            : 'border-gray-300 hover:bg-gray-50 hover:text-red-500'
        }`}
      >
        <Heart size={24} fill={wishlistAdded ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
