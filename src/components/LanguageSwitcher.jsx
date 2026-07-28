import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'AR' },
  { code: 'en', label: 'EN' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2) || 'fr';

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`text-[10px] font-bold px-2 py-1 rounded-full transition-all duration-200 ${
            current === code
              ? 'bg-brand-red text-white shadow-sm'
              : 'text-gray-500 hover:text-brand-dark'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
