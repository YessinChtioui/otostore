'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Link, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      // Automatically log in
      const signInRes = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push('/auth/login');
      } else {
        router.push('/account');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-950 transition-colors py-16 min-h-[70vh] flex flex-col justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Créer un compte</h1>
            <p className="text-gray-500 dark:text-gray-400">Rejoignez OTO STORE aujourd'hui</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm mb-6 border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom complet *</label>
              <Input name="name" required value={formData.name} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Numéro de téléphone *</label>
              <Input name="phone" type="tel" required value={formData.phone} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
              <Input name="email" type="email" required value={formData.email} onChange={handleChange} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mot de passe *</label>
              <div className="relative">
                <Input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  minLength={6} 
                  value={formData.password} 
                  onChange={handleChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Au moins 6 caractères</p>
            </div>

            <Button type="submit" className="w-full mt-4 h-12 text-lg shadow-md" disabled={loading}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Vous avez déjà un compte ?{' '}
            <Link href="/auth/login" className="text-[var(--color-brand-blue)] font-bold hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
