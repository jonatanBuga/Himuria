import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/home', label: t('home'), icon: '🏠' },
    { to: '/predictions', label: t('predictions'), icon: '🎯' },
    { to: '/leaderboard', label: t('leaderboard'), icon: '🏆' },
    { to: '/profile', label: t('profile'), icon: '👤' },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 flex-col p-4">
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
