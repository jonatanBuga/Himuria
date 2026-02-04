import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/home', label: t('home'), icon: '🏠' },
    { to: '/predictions', label: t('predictions'), icon: '🎯' },
    { to: '/leaderboard', label: t('leaderboard'), icon: '🏆' },
    { to: '/profile', label: t('profile'), icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`
            }
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
