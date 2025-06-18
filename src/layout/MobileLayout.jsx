// src/layouts/MobileLayout.jsx
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  HomeIcon,
  CameraIcon,
  UserIcon,
  PlusCircleIcon, // 👈 nuevo ícono importado
} from '@heroicons/react/24/outline';

const tabs = [
  { name: 'Muebles', path: '/', icon: HomeIcon },
  { name: 'Escanear', path: '/scanner', icon: CameraIcon },
  { name: 'Registrar', path: '/registrar', icon: PlusCircleIcon }, // 👈 nuevo tab con ícono distinto
  { name: 'Perfil', path: '/perfil', icon: UserIcon },
];

export default function MobileLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around items-center h-16">
        {tabs.map(({ name, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={name}
              to={path}
              className={`flex flex-col items-center justify-center text-xs font-medium ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              {name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
