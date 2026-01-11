import { useLanguage } from '../contexts/LanguageContext.tsx';

export default function SendMessagePage() {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">{t('templates.sendEmail')}</h1>
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-8 text-center">
        <p className="text-zinc-400">{t('common.comingSoon')}</p>
      </div>
    </div>
  );
}

