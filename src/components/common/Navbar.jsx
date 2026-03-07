import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Heart, Bell, Trash2, CheckCircle2, AlertCircle, Calendar as CalendarIcon, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';
import { fetchNotifications, addNotification, markNotificationAsRead, markAllNotificationsAsRead } from '../../app/features/notificationSlice';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../app/features/authSlice';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { list: notifications, unreadCount } = useSelector((state) => state.notifications);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());

      const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        withCredentials: true,
      });

      socket.on('newNotification', (data) => {
        if (data.userId === user._id) {
          dispatch(addNotification(data.notification));
        }
      });

      socket.on('globalUpdate', () => {
        dispatch(fetchNotifications());
      });

      return () => socket.disconnect();
    }
  }, [isAuthenticated, user?._id, dispatch]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Restaurants', path: '/restaurants' },
    { name: 'Testimonials', path: '/testimonials' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'owner') return '/dashboard/owner';
    return '/dashboard/user';
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-zinc-950/90 backdrop-blur-md border-b border-white/10 py-4 shadow-lg'
        : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-serif font-bold text-white tracking-wider group-hover:text-amber-500 transition-colors duration-300">
              RESERVE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {(!user || user.role === 'user') && navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm tracking-wide font-medium transition-colors duration-300 hover:text-amber-500 ${location.pathname === link.path
                  ? 'text-amber-500'
                  : 'text-zinc-400'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {user?.role === 'user' && (
                  <Link
                    to="/become-partner"
                    className="flex items-center text-amber-500 hover:text-white transition-colors text-sm font-medium tracking-wide mr-4 border border-amber-500/50 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg"
                  >
                    Become a Partner
                  </Link>
                )}
                {user?.role === 'user' && (
                  <Link
                    to="/favorites"
                    className="flex items-center text-zinc-400 hover:text-amber-500 transition-colors text-sm font-medium tracking-wide mr-4"
                  >
                    <Heart className="w-5 h-5 mr-1" />
                    Favorites
                  </Link>
                )}

                {/* Notification Bell */}
                <div className="relative mr-4">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-zinc-400 hover:text-amber-500 transition-colors rounded-full hover:bg-white/5"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]"
                      >
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                          <h3 className="text-sm font-semibold text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={() => dispatch(markAllNotificationsAsRead())}
                              className="text-[10px] text-amber-500 hover:text-amber-400 uppercase tracking-wider font-bold"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <div
                                key={n._id}
                                onClick={() => {
                                  dispatch(markNotificationAsRead(n._id));
                                  if (n.link) navigate(n.link);
                                  setShowNotifications(false);
                                }}
                                className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors relative ${!n.isRead ? 'bg-amber-500/5' : ''}`}
                              >
                                {!n.isRead && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full" />}
                                <div className="flex gap-3">
                                  <div className="mt-0.5">
                                    {n.type?.includes('reservation_confirmed') && <CheckCircle2 size={16} className="text-green-500" />}
                                    {n.type?.includes('reservation_cancelled') && <AlertCircle size={16} className="text-red-500" />}
                                    {n.type?.includes('reservation_completed') && <MessageSquare size={16} className="text-amber-500" />}
                                    {n.type?.includes('support') && <Ticket size={16} className="text-blue-500" />}
                                  </div>
                                  <div>
                                    <p className={`text-xs leading-relaxed ${!n.isRead ? 'text-white font-medium' : 'text-zinc-400'}`}>
                                      {n.message}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 mt-1">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center text-zinc-500 italic text-sm">
                              No notifications yet
                            </div>
                          )}
                        </div>
                        <Link
                          to="/dashboard/user"
                          onClick={() => setShowNotifications(false)}
                          className="block p-3 text-center text-[10px] text-zinc-500 hover:text-white border-t border-white/5 bg-black/20 uppercase tracking-[0.2em] font-bold"
                        >
                          View All Activity
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link
                  to={getDashboardLink()}
                  className="flex items-center text-white hover:text-amber-500 transition-colors text-sm font-medium tracking-wide"
                >
                  <User className="w-5 h-5 mr-2" />
                  {user?.name || 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-zinc-400 hover:text-red-400 transition-colors text-sm font-medium tracking-wide"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/become-partner"
                  className="text-white hover:text-amber-500 transition-colors text-sm font-medium tracking-wide mr-6"
                >
                  Partner with us
                </Link>
                <Link
                  to="/login"
                  className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-amber-500 transition-colors p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/40 backdrop-blur-md border border-white/10 border-t border-white/10 absolute top-full left-0 w-full overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col bg-zinc-950/95 backdrop-blur-xl">
              {(!user || user.role === 'user') && navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium ${location.pathname === link.path
                    ? 'text-amber-500 bg-white/5'
                    : 'text-zinc-400 hover:text-amber-500 hover:bg-white/5 transition-colors'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    {user?.role === 'user' && (
                      <Link
                        to="/become-partner"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center px-4 py-3 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors flex items-center justify-center font-medium mb-1"
                      >
                        Become a Partner
                      </Link>
                    )}
                    {user?.role === 'user' && (
                      <Link
                        to="/favorites"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center px-4 py-3 bg-zinc-900 border border-white/10 text-zinc-300 rounded-lg hover:border-amber-500 hover:text-amber-500 transition-colors flex items-center justify-center font-medium mb-1"
                      >
                        <Heart className="w-5 h-5 mr-2" />
                        Favorites
                      </Link>
                    )}
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center px-4 py-3 bg-white/5 text-white border border-white/20 rounded-lg hover:border-amber-500 hover:text-amber-500 transition-colors flex items-center justify-center"
                    >
                      <User className="w-5 h-5 mr-2" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-center px-4 py-3 bg-red-500/10 text-red-400 rounded-lg font-semibold flex items-center justify-center transition-colors hover:bg-red-500/20"
                    >
                      <LogOut className="w-5 h-5 mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/become-partner"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center px-4 py-3 text-amber-500 border border-amber-500/20 rounded-lg hover:border-amber-500 hover:bg-amber-500/10 transition-colors"
                    >
                      Partner with us
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center px-4 py-3 bg-amber-500 text-black rounded-lg font-semibold mt-2"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
