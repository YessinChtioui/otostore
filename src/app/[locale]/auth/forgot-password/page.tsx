'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage('Si un compte existe pour cette adresse, un email de réinitialisation vous a été envoyé.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-950 transition-colors py-24 min-h-[70vh] flex flex-col justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mot de passe oublié</h1>
            <p className="text-gray-500 dark:text-gray-400">Entrez votre email pour réinitialiser votre mot de passe</p>
          </div>

          {message && (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-lg text-sm mb-6 border border-green-100 dark:border-green-900/50">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm mb-6 border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <Input 
                name="email" 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <Button type="submit" className="w-full mt-2 h-12 text-lg shadow-md" disabled={loading}>
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/auth/login" className="text-[var(--color-brand-blue)] font-bold hover:underline">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
