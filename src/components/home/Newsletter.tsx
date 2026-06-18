'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <section className="py-20 bg-[var(--color-brand-blue)] dark:bg-gray-950 text-white relative overflow-hidden transition-colors">
      {/* Abstract circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[var(--color-brand-orange)] opacity-20 blur-3xl"></div>
      
      <div className="container-custom relative z-10 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Abonnez-vous à notre Newsletter</h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Recevez nos offres exclusives, nouveautés et conseils d'entretien pour votre voiture directement dans votre boîte mail.
        </p>
        
        {status === 'success' ? (
          <div className="bg-white/20 p-4 rounded-lg inline-block backdrop-blur-sm">
            <p className="font-bold">Merci pour votre inscription ! 🎉</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
            <Input 
              type="email" 
              placeholder="Votre adresse email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white h-12"
              required
            />
            <Button 
              type="submit" 
              className="bg-[var(--color-brand-orange)] hover:bg-orange-600 text-white font-bold h-12 px-8 whitespace-nowrap border-none"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Inscription...' : 'S\'abonner'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
