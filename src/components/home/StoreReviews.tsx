'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Star, MessageSquareQuote } from 'lucide-react';

interface StoreReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string | Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

export default function StoreReviews({ session }: { session: any }) {
  const router = useRouter();
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/store-reviews')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch store reviews', err);
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setError('Vous devez être connecté pour laisser un avis.');
      return;
    }

    if (!comment.trim()) {
      setError('Veuillez écrire un commentaire.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/store-reviews`, {
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
      setShowForm(false);
      router.refresh();
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
        size={interactive ? 32 : 18}
        className={`${
          i < ratingValue 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300 dark:text-gray-600'
        } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        onClick={interactive ? () => setRating(i + 1) : undefined}
      />
    ));
  };

  if (isLoading) return null;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="h2 mb-4 dark:text-white">Ce que disent nos clients</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez les avis de notre communauté sur leur expérience d'achat avec OTO STORE.
          </p>
        </div>

        {/* Reviews Grid */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reviews.slice(0, 6).map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative">
                <MessageSquareQuote size={40} className="absolute top-6 right-6 text-gray-100 dark:text-gray-800" />
                <div className="flex gap-1 mb-4 relative z-10">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 relative z-10 line-clamp-4 min-h-[96px]">
                  "{review.comment}"
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand-blue)] text-white flex items-center justify-center font-bold overflow-hidden">
                    {review.user?.image ? (
                      <img src={review.user.image} alt={review.user.name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      review.user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{review.user?.name || 'Client OTO STORE'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mb-12 italic">
            Aucun avis pour le moment. Soyez le premier !
          </div>
        )}

        {/* Add Review Action */}
        <div className="max-w-xl mx-auto text-center">
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} className="h-12 px-8 shadow-md">
              Laisser un avis sur la boutique
            </Button>
          ) : (
            <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 text-left animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold dark:text-white">Votre expérience</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  ✕
                </button>
              </div>

              {!session?.user ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center">
                  <p className="text-blue-800 dark:text-blue-300 mb-4 font-medium">Vous devez être connecté pour laisser un avis.</p>
                  <Button onClick={() => router.push('/auth/login')} className="w-full">
                    Se connecter
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                  
                  <div className="mb-6 flex flex-col items-center justify-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quelle note donnez-vous à OTO STORE ?</label>
                    <div className="flex gap-2">
                      {renderStars(rating, true)}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Votre commentaire</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] min-h-[120px] dark:text-white transition-colors"
                      placeholder="Comment s'est passée votre commande ? Êtes-vous satisfait du service ?"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full h-12 text-lg shadow-md" disabled={isSubmitting}>
                    {isSubmitting ? 'Envoi...' : 'Publier mon avis'}
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
