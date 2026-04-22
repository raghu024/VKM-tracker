import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, CheckSquare, Trophy, Bell, User, Menu, X, LogOut, Settings, ChevronRight, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { useUserStore } from '../stores/useUserStore.js';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Trophy, label: 'Board', path: '/leaderboard' },
  { icon: BookOpen, label: 'Library', path: '/library' },
  { icon: Bell, label: 'Alerts', path: '/notifications' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function OwnerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayUser = {
    ...profile,
    email: user?.email || '',
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Define dynamic sidebar groups based on roles
  const dynamicSidebarLinks = [
    { section: 'MAIN', items: [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: CheckSquare, label: 'Weekly Tasks', path: '/tasks' },
      { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
      { icon: BookOpen, label: 'Resources', path: '/library' },
    ]},
    { section: 'PERSONAL', items: [
      { icon: Bell, label: 'Notifications', path: '/notifications' },
      { icon: User, label: 'My Profile', path: '/profile' },
    ]},
  ];

  // Add Admin section if role is admin or super_admin
  if (profile.role === 'admin' || profile.role === 'super_admin') {
    dynamicSidebarLinks.push({
      section: 'ADMINISTRATION',
      items: [
        { icon: Settings, label: 'Admin Panel', path: '/admin' },
      ]
    });
  }

  // Add Super Admin section if role is super_admin
  if (profile.role === 'super_admin') {
    dynamicSidebarLinks.push({
      section: 'SYSTEM',
      items: [
        { icon: Settings, label: 'Super Admin', path: '/super-admin' },
      ]
    });
  }

  // Same for mobile nav items
  const dynamicNavItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Trophy, label: 'Board', path: '/leaderboard' },
    { icon: BookOpen, label: 'Library', path: '/library' },
    { icon: Bell, label: 'Alerts', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  if (profile.role === 'admin' || profile.role === 'super_admin') {
    dynamicNavItems.push({ icon: Settings, label: 'Admin', path: '/admin' });
  }

  return (
    <div className="flex h-screen w-full bg-bg-primary overflow-hidden">

      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden lg:flex flex-col w-72 h-full bg-bg-secondary/95 backdrop-blur-xl border-r border-gold/10 z-20">
        {/* Logo */}
        <div className="p-6 border-b border-gold/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-bg-primary font-bold text-lg">VK</span>
            </div>
            <div>
              <h1 className="text-base font-bold gold-text font-display">VK & SIP</h1>
              <p className="text-[11px] text-text-secondary tracking-wider">MENTORSHIP PROGRAM</p>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {dynamicSidebarLinks.map((group) => (
            <div key={group.section}>
              <p className="px-4 mb-2 text-[10px] font-semibold text-text-secondary tracking-[0.15em]">{group.section}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? 'bg-gold/10 text-gold border border-gold/20 shadow-sm'
                          : 'text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary'
                      }`
                    }
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                    <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom User Card */}
        <div className="p-4 border-t border-gold/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-tertiary/40">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/80 to-gold-dark flex items-center justify-center text-sm font-bold text-bg-primary">
              {displayUser.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{displayUser.full_name}</p>
              <p className="text-xs text-text-secondary truncate">{displayUser.business_name}</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-bg-tertiary transition-colors text-text-secondary hover:text-error" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 glass-strong h-14 flex items-center justify-between px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-bg-primary font-bold text-xs">VK</span>
            </div>
            <span className="text-sm font-bold gold-text font-display">VK & SIP</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-bg-tertiary border border-gold-dark/30 text-gold font-mono">
              W1/12
            </span>
            <div className="relative cursor-pointer" onClick={() => navigate('/notifications')}>
              <Bell size={18} className="text-text-secondary" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full ring-2 ring-bg-primary"></span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex justify-around items-center h-16 px-1 overflow-x-auto no-scrollbar">
          {dynamicNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 transition-all duration-200 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomnav-indicator"
                    className="absolute -top-0.5 w-5 h-0.5 bg-gold rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon
                  size={20}
                  className={`mb-0.5 transition-colors duration-200 ${isActive ? 'text-gold' : 'text-text-secondary'}`}
                />
                <span className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? 'text-gold' : 'text-text-secondary'}`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
