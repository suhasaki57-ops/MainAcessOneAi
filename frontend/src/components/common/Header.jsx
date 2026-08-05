import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useSidebar } from '../../context/SidebarContext';
import Dropdown from '../ui/Dropdown';
import CommandPalette from '../ui/CommandPalette';
import { FiSun, FiMoon, FiUser, FiLogOut, FiShield, FiSearch, FiBell, FiMenu, FiSettings } from 'react-icons/fi';
import { APP_NAME, ROUTES } from '../../constants';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { themeMode, toggleTheme } = useTheme();
  const { toggleMobileSidebar, toggleSidebar } = useSidebar();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const userMenuItems = [
    { label: 'My Profile', icon: FiUser, onClick: () => navigate('/profile') },
    { label: 'Settings', icon: FiSettings, onClick: () => navigate('/settings') },
    { label: 'Sign Out', icon: FiLogOut, danger: true, onClick: logout },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-800/80 backdrop-blur-xl px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Left Side: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileSidebar}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-xl bg-slate-800/60 text-slate-300 hover:text-white"
          >
            <FiMenu className="text-xl" />
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <FiShield className="text-white text-xl" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white hidden sm:inline">
              {APP_NAME}
            </span>
          </Link>
        </div>

        {/* Center: Command Palette Trigger Search */}
        <button
          onClick={() => setIsCommandOpen(true)}
          className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl glass-input border border-slate-700/60 text-slate-400 hover:text-slate-200 text-xs w-64 lg:w-96 transition-all"
        >
          <FiSearch className="text-cyan-400 text-sm" />
          <span>Quick search or command...</span>
          <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
            Ctrl + K
          </kbd>
        </button>

        {/* Right Side: Theme, Notifications, User Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 transition-all border border-slate-700/40"
          >
            {themeMode === 'dark' ? <FiSun className="text-amber-400 text-lg" /> : <FiMoon className="text-cyan-400 text-lg" />}
          </button>

          {/* Notifications Trigger */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 relative border border-slate-700/40"
              >
                <FiBell className="text-lg" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-4 z-50 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-white text-xs">Notifications</h4>
                    <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded-full">2 New</span>
                  </div>
                  <div className="flex flex-col gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <p className="font-semibold text-slate-200">Accessibility Audit Completed</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Scanned URL achieved 94.8 WCAG rating.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <p className="font-semibold text-slate-200">Document Upload Processed</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">WCAG_Guidelines.pdf OCR complete.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile Menu */}
          {isAuthenticated ? (
            <Dropdown
              trigger={
                <div className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-slate-800/60 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-cyan-500/20">
                    {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 hidden lg:inline max-w-[120px] truncate">
                    {user?.full_name || user?.email}
                  </span>
                </div>
              }
              items={userMenuItems}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all shadow-md shadow-cyan-600/30"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
};

export default Header;
