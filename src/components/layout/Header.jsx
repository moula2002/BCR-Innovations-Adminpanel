import { Bell, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/': return 'Dashboard';
    case '/products': return 'Product Management';
    case '/categories': return 'Category Management';
    case '/inquiries': return 'Inquiries';
    case '/settings': return 'Profile Settings';
    default: return 'Admin Panel';
  }
};

const Header = ({ setIsSidebarOpen }) => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <header className="h-20 bg-admin-panel/80 backdrop-blur-md border-b border-admin-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button 
          className="md:hidden p-2 text-slate-500 hover:text-bcr-blue hover:bg-bcr-blue-light rounded-xl transition-colors"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 truncate">{title}</h1>
        <span className="px-3 py-1 bg-bcr-orange-light text-bcr-orange text-xs font-bold rounded-full ml-4 hidden sm:block">
          Live updates
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-bcr-blue transition-colors rounded-full hover:bg-bcr-blue-light">
          <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-bcr-orange rounded-full border-2 border-white"></span>
          <Bell size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
