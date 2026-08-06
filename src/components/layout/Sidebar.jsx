import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../services/api';
import BcrLogo from '../BcrLogo';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  MessageSquare, 
  Image as ImageIcon, 
  Phone, 
  Settings,
  LogOut,
  Briefcase
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/categories', label: 'Categories', icon: <Tags size={20} /> },
  { path: '/subcategories', label: 'Subcategories', icon: <Tags size={20} /> },
  { path: '/products', label: 'Products', icon: <Package size={20} /> },
  { path: '/careers', label: 'Careers', icon: <Briefcase size={20} /> },
  { path: '/inquiries', label: 'Inquiries', icon: <MessageSquare size={20} /> },
  { path: '/settings', label: 'Profile Settings', icon: <Settings size={20} /> },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [adminProfile, setAdminProfile] = useState({ username: '', profileImage: null });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const fetchProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const res = await api.get('/auth/profile');
      if (res.data.success) {
        setAdminProfile({
          username: res.data.data.username || 'Admin',
          profileImage: res.data.data.profileImage || null
        });
      }
    } catch (error) {
      console.error("Error fetching profile in sidebar:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    window.addEventListener('profileUpdated', fetchProfile);
    return () => window.removeEventListener('profileUpdated', fetchProfile);
  }, []);
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-admin-panel border-r border-admin-border flex flex-col shadow-xl transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-20 flex items-center px-6 border-b border-admin-border">
        <div className="flex items-center gap-3">
          <BcrLogo />
          <span className="text-2xl font-bold text-bcr-blue tracking-tight">
            Innovations
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-xs font-semibold text-admin-muted uppercase tracking-wider mb-2 px-4">Menu</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-bcr-blue text-white shadow-md shadow-bcr-blue/30 scale-[1.02]'
                    : 'text-slate-600 hover:bg-bcr-blue-light hover:text-bcr-blue'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t border-admin-border bg-slate-50/50">
        <div className="flex items-center gap-3 px-2">
          {isLoadingProfile ? (
            <>
              <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0"></div>
              <div className="flex flex-col flex-1 gap-2 overflow-hidden">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-200 animate-pulse"></div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-admin-border shadow-sm overflow-hidden shrink-0">
                {adminProfile.profileImage ? (
                  <img src={adminProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-slate-500">
                    {adminProfile.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-sm font-semibold text-slate-800 truncate" title={adminProfile.username}>
                  {adminProfile.username}
                </span>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  window.location.href = '/';
                }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Log Out"
              >
                <LogOut size={20} />
              </button>
            </>
          )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
