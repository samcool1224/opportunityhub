import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Bell,
  Search,
  Check,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getNotifications, markNotificationRead } from '@/lib/database';

interface NavigationProps {
  user?: {
    name: string;
    role: 'student' | 'professor';
    avatar?: string;
  } | null;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  created_at: string;
  read_at: string | null;
}

export const Navigation = ({ user: propUser }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, signOut, loading: authLoading } = useAuth();

  // Use auth user if available, otherwise use prop user (for compatibility)
  const user = authUser ? {
    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
    role: authUser.user_metadata?.role || 'student',
    avatar: authUser.user_metadata?.avatar_url
  } : propUser;

  const isActive = (path: string) => location.pathname === path;

  // Detect hero visibility for navigation styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Only show transparent nav when at the very top (0px)
      setIsHeroVisible(scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    setIsLoggingOut(true);
    try {
      console.log('Starting logout process...');
      await signOut();
      console.log('Logout successful, navigating to home...');
      
      // Force navigation to home page
      navigate('/', { replace: true });
      
      // Fallback: if navigation doesn't work, force page reload
      setTimeout(() => {
        if (window.location.pathname !== '/') {
          console.log('Navigation failed, forcing page reload...');
          window.location.href = '/';
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, try to navigate to home
      navigate('/', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      if (!authUser?.id || authLoading) return;
      
      try {
        const { data } = await getNotifications(authUser.id);
        if (data) {
          setNotifications(data);
          setUnreadCount(data.filter((n: Notification) => !n.read_at).length);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    };

    loadNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [authUser?.id, authLoading]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const mainLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Opportunities', path: '/opportunities' },
    { name: 'Applications', path: '/applications' },
    { name: 'About', path: '/about' }
  ];

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'student' ? '/student/dashboard' : '/professor/dashboard';
  };

  // Don't render user menu if still loading or no user
  if (authLoading || !user) {
    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHeroVisible ? 'nav-hero-integrated' : 'glass-nav'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className={`text-2xl font-bold hover:scale-105 transition-transform duration-300 ${
                isHeroVisible
                  ? 'text-black drop-shadow-lg'
                  : 'bg-gradient-hero bg-clip-text text-transparent'
              }`}
            >
              <img src="/favicon.svg" alt="FutureForge Logo" className="h-8 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {mainLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''} ${
                    isHeroVisible ? 'text-black hover:text-[#FFA800]' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="outline" 
                asChild
                className={`rounded-full border-primary/20 hover:border-primary hover:bg-primary/5 ${
                  isHeroVisible ? 'text-black border-black/20 hover:border-black/40' : ''
                }`}
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button 
                asChild
                className={`btn-hero ${
                  isHeroVisible ? 'text-black bg-white/80 hover:bg-white' : ''
                }`}
              >
                <Link to="/register/student">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className={`rounded-full h-10 w-10 p-0 ${
                  isHeroVisible ? 'text-black hover:text-[#FFA800]' : ''
                }`}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={`md:hidden border-t border-white/20 ${
            isHeroVisible ? 'bg-white/90 backdrop-blur-xl' : 'glass'
          }`}>
            <div className="px-4 pt-4 pb-6 space-y-4">
              {mainLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? isHeroVisible ? 'text-black bg-black/10' : 'text-primary bg-primary/10'
                      : isHeroVisible ? 'text-black hover:text-[#FFA800] hover:bg-black/5' : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="space-y-2 pt-4 border-t border-white/20">
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isHeroVisible ? 'text-black hover:text-[#FFA800] hover:bg-black/5' : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register/student"
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isHeroVisible ? 'text-black bg-white/80 hover:bg-white' : 'bg-gradient-hero text-primary-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isHeroVisible ? 'nav-hero-integrated' : 'glass-nav'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className={`text-2xl font-bold hover:scale-105 transition-transform duration-300 ${
              isHeroVisible
                ? 'text-black drop-shadow-lg'
                : 'bg-gradient-hero bg-clip-text text-transparent'
            }`}
          >
            <img src="/favicon.svg" alt="FutureForge Logo" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''} ${
                  isHeroVisible ? 'text-black hover:text-[#FFA800]' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                

                {/* Notifications */}
                <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`rounded-full h-10 w-10 p-0 relative ${
                        isHeroVisible ? 'text-black hover:text-[#FFA800]' : ''
                      }`}
                    >
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="glass w-80 border-0 max-h-96 overflow-y-auto"
                  >
                    <div className="px-3 py-2 border-b border-border/20">
                      <p className="text-sm font-medium">Notifications</p>
                      {unreadCount > 0 && (
                        <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                      )}
                    </div>
                    
                    {notifications.length === 0 ? (
                      <div className="px-3 py-8 text-center text-muted-foreground">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      <div className="py-2">
                        {notifications.slice(0, 10).map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-3 py-2 hover:bg-muted/20 transition-colors ${
                              !notification.read_at ? 'bg-primary/5' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {notification.body}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(notification.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              
                              {!notification.read_at && (
                                <div className="flex items-center space-x-1 ml-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {notifications.length > 10 && (
                          <div className="px-3 py-2 border-t border-border/20">
                            <p className="text-xs text-muted-foreground text-center">
                              {notifications.length - 10} more notifications
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`rounded-full h-10 w-10 p-0 glass ${
                        isHeroVisible ? 'text-black hover:text-[#FFA800]' : ''
                      }`}
                    >
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="glass w-56 border-0"
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.role}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()}>
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/profile`}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  asChild
                  className={`rounded-full border-primary/20 hover:border-primary hover:bg-primary/5 ${
                    isHeroVisible ? 'text-black border-black/20 hover:border-black/40' : ''
                  }`}
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button 
                  asChild
                  className={`btn-hero ${
                    isHeroVisible ? 'text-black bg-white/80 hover:bg-white' : ''
                  }`}
                >
                  <Link to="/register/student">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className={`rounded-full h-10 w-10 p-0 ${
                isHeroVisible ? 'text-black hover:text-[#FFA800]' : ''
              }`}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden border-t border-white/20 ${
          isHeroVisible ? 'bg-white/90 backdrop-blur-xl' : 'glass'
        }`}>
          <div className="px-4 pt-4 pb-6 space-y-4">
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? isHeroVisible ? 'text-black bg-black/10' : 'text-primary bg-primary/10'
                    : isHeroVisible ? 'text-black hover:text-orange-600 hover:bg-black/5' : 'text-foreground hover:text-primary hover:bg-primary/5'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="space-y-2 pt-4 border-t border-white/20">
                <Link
                  to={getDashboardLink()}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isHeroVisible ? 'text-black hover:text-orange-600 hover:bg-black/5' : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to={`/profile`}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isHeroVisible ? 'text-black hover:text-orange-600 hover:bg-black/5' : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  disabled={isLoggingOut}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
                    isLoggingOut ? 'opacity-50 cursor-not-allowed' : isHeroVisible ? 'text-black hover:text-orange-600 hover:bg-black/5' : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-4 border-t border-white/20">
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isHeroVisible ? 'text-black hover:text-orange-600 hover:bg-black/5' : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register/student"
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isHeroVisible ? 'text-black bg-white/80 hover:bg-white' : 'bg-gradient-hero text-primary-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};