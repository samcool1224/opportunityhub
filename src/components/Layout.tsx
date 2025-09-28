import { ReactNode, useEffect } from 'react';
import { Navigation } from './Navigation';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  user?: {
    name: string;
    role: 'student' | 'professor';
    avatar?: string;
  } | null;
}

export const Layout = ({ children, user }: LayoutProps) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};