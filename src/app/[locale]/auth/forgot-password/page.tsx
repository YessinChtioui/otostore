'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link, useRouter } from '@/i18n/routing';
import { ArrowLeft, Mail, KeyRound, Lock } from 'lucide-react';

type Step = 'email' | 'code' | 'password';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur serveur');
      }

      setStep('code');
      setSuccess('Un code à 6 chiffres a été envoyé à votre adresse email.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }
    setError('');
    setSuccess('');
    setStep('password');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur serveur');
      }

      setSuccess('Mot de passe réinitialisé avec succès ! Redirection...');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepConfig = {
    email: {
      icon: <Mail size={28} />,
      title: 'Mot de passe oublié ?',
      subtitle: 'Entrez votre adresse email et nous vous enverrons un code de vérification.',
    },
    code: {
      icon: <KeyRound size={28} />,
      title: 'Vérification',
      subtitle: `Un code à 6 chiffres a été envoyé à ${email}`,
    },
    password: {
      icon: <Lock size={28} />,
      title: 'Nouveau mot de passe',
      subtitle: 'Choisissez un nouveau mot de passe pour votre compte.',
    },
  };

  const current = stepConfig[step];

  return (
    <main className="bg-gray-50 dark:bg-gray-950 transition-colors py-24 min-h-[70vh] flex flex-col justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {(['email', 'code', 'password'] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-[var(--color-brand-blue)]'
                    : i < ['email', 'code', 'password'].indexOf(step)
                    ? 'w-2 bg-[var(--color-brand-blue)]'
                    : 'w-2 bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-brand-blue)]">
              {current.icon}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{current.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{current.subtitle}</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm mb-6 border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-lg text-sm mb-6 border border-green-100 dark:border-green-900/50">
              {success}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adresse email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Envoyer le code'}
              </Button>
            </form>
          )}

          {/* Step 2: Code */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code à 6 chiffres</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="text-center text-2xl tracking-[0.5em] font-bold"
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg">
                Vérifier le code
              </Button>
              <button
                type="button"
                onClick={() => { setStep('email'); setError(''); setSuccess(''); }}
                className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors"
              >
                Renvoyer le code
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nouveau mot de passe</label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirmer le mot de passe</label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retapez le mot de passe"
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </Button>
            </form>
          )}

          {/* Back to login */}
          <div className="mt-8 text-center">
            <Link href="/auth/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors flex items-center justify-center gap-2">
              <ArrowLeft size={16} /> Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
