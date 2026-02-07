import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { supabase } from '../lib/supabase.ts';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

export default function SignInPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast.success(t('auth.signUpSuccess'));
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success(t('auth.signInSuccess'));
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-4xl font-bold text-brand">
            <Mail className="w-10 h-10" />
            <span>Mei Way Mail Plus</span>
          </div>
          <p className="text-gray-600 mt-2 text-lg">
            {t('auth.tagline')}
          </p>
        </div>

        {/* App Description */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('auth.welcomeTitle')}</h2>
          <p className="text-gray-700 mb-4">
            {t('auth.welcomeSubtitle')}
          </p>
          
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0"></div>
              <p><strong>{t('auth.services.mailbox')}:</strong> {t('auth.services.mailboxDesc')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0"></div>
              <p><strong>{t('auth.services.virtual')}:</strong> {t('auth.services.virtualDesc')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0"></div>
              <p><strong>{t('auth.services.shipping')}:</strong> {t('auth.services.shippingDesc')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0"></div>
              <p><strong>{t('auth.services.business')}:</strong> {t('auth.services.businessDesc')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0"></div>
              <p><strong>{t('auth.services.notifications')}:</strong> {t('auth.services.notificationsDesc')}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>{t('auth.location')}:</strong> 37-02 Main Street, Unit B1, Flushing, NY 11354<br/>
              <strong>{t('auth.phone')}:</strong> <a href="tel:646-535-0363" className="text-brand hover:text-brand-hover">646-535-0363</a><br/>
              <strong>{t('common.email')}:</strong> <a href="mailto:info@meiwaymail.com" className="text-brand hover:text-brand-hover">info@meiwaymail.com</a>
            </p>
          </div>
        </div>

        {/* Sign In/Up Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            {isSignUp ? t('auth.staffRegistration') : t('auth.staffSignIn')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.email')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : isSignUp ? t('auth.signUp') : t('auth.signIn')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-brand hover:text-brand-hover transition-colors"
            >
              {isSignUp
                ? t('auth.alreadyHaveAccount')
                : t('auth.dontHaveAccount')}
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <a href="/privacy-policy" className="text-brand hover:text-brand-hover transition-colors">
            {t('auth.privacyPolicy')}
          </a>
          <span className="mx-2">·</span>
          <a href="/terms-of-service" className="text-brand hover:text-brand-hover transition-colors">
            {t('auth.termsOfService')}
          </a>
        </div>
      </div>
    </div>
  );
}
