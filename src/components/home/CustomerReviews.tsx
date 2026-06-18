import { Star } from 'lucide-react';

const reviews = [
  { id: 1, name: 'Ahmed M.', rating: 5, comment: 'Excellente qualité de housses de siège, livraison rapide à Sfax.', date: 'Il y a 2 jours' },
  { id: 2, name: 'Sami B.', rating: 5, comment: 'La dashcam est top, très facile à installer. Service client réactif.', date: 'Il y a 1 semaine' },
  { id: 3, name: 'Yasmine T.', rating: 4, comment: 'Bons produits, paiement à la livraison très pratique. Je recommande.', date: 'Il y a 2 semaines' },
];

export default function CustomerReviews() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
      <div className="container-custom">
        <h2 className="h2 mb-10 text-center dark:text-white">Avis de nos Clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors relative">
              {/* Quote icon mark */}
              <div className="absolute top-4 right-4 opacity-10 text-6xl text-[var(--color-brand-blue)]">"</div>
              
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < review.rating ? 'currentColor' : 'none'} stroke={i < review.rating ? 'currentColor' : '#cbd5e1'} />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 italic">"{review.comment}"</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{review.name}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
