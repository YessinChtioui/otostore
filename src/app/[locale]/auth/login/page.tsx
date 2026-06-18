'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const t = useTranslations('Navigation');
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        setError('Email ou mot de passe incorrect');
      } else {
        router.push('/account');
        router.refresh();
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-950 transition-colors py-24 min-h-[70vh] flex flex-col justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Connexion</h1>
            <p className="text-gray-500 dark:text-gray-400">Accédez à votre compte OTO STORE</p>
          </div>

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
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe</label>
                <Link href="/auth/forgot-password" className="text-sm text-[var(--color-brand-blue)] hover:underline">
                  Oublié ?
                </Link>
              </div>
              <Input 
                name="password" 
                type="password" 
                required 
                value={formData.password} 
                onChange={handleChange} 
              />
            </div>

            <Button type="submit" className="w-full mt-2 h-12 text-lg shadow-md" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Vous n'avez pas de compte ?{' '}
            <Link href="/auth/register" className="text-[var(--color-brand-blue)] font-bold hover:underline">
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
