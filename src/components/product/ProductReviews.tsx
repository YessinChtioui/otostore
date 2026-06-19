'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string | Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ProductReviewsProps {
  productId: string;
  initialReviews: Review[];
  session: any;
}

export default function ProductReviews({ productId, initialReviews, session }: ProductReviewsProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setError('Vous devez être connecté pour laisser un avis.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur serveur');
      }

      const newReview = await res.json();
      setReviews([newReview, ...reviews]);
      setComment('');
      setRating(5);
      router.refresh(); // Refresh page data
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (ratingValue: number, interactive = false) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={interactive ? 28 : 16}
        className={`${
          i < ratingValue 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300 dark:text-gray-600'
        } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        onClick={interactive ? () => setRating(i + 1) : undefined}
      />
    ));
  };

  return (
    <div className="mt-16 border-t border-gray-100 dark:border-gray-800 pt-12">
      <h2 className="text-2xl font-bold mb-8 dark:text-white">Avis Clients</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Rating Summary & Form */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl text-center">
            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{avgRating}</div>
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(Math.round(Number(avgRating)))}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Basé sur {reviews.length} avis</p>
          </div>

          {session?.user ? (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold mb-4 dark:text-white">Laisser un avis</h3>
              
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Note</label>
                <div className="flex gap-1">
                  {renderStars(rating, true)}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Commentaire (optionnel)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] min-h-[100px] dark:text-white"
                  placeholder="Qu'avez-vous pensé de ce produit ?"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Envoi...' : 'Envoyer mon avis'}
              </Button>
            </form>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center">
              <p className="text-blue-800 dark:text-blue-300 mb-4 text-sm font-medium">Connectez-vous pour laisser un avis sur ce produit.</p>
              <Button onClick={() => router.push('/auth/login')} variant="outline" className="w-full bg-white dark:bg-gray-800">
                Se connecter
              </Button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold overflow-hidden">
                      {review.user?.image ? (
                        <img src={review.user.image} alt={review.user.name || 'User'} className="w-full h-full object-cover" />
                      ) : (
                        review.user?.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{review.user?.name || 'Utilisateur Anonyme'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 dark:text-gray-300 mt-3 text-sm leading-relaxed pl-13">
                    {review.comment}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
