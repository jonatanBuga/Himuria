import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            {t('appName')}
          </Link>
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {i18n.language === 'en' ? 'עב' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
