import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.user_metadata?.role) {
      // Redirect to appropriate dashboard
      const role = user.user_metadata.role;
      const dashboardPath = role === 'student' ? '/student/dashboard' : '/professor/dashboard';
      navigate(dashboardPath);
    }
  }, [navigate, user]);

  // Show loading while redirecting
  const layoutUser = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    role: user.user_metadata?.role || 'student',
    avatar: user.user_metadata?.avatar_url
  } : null;

  return (
    <ProtectedRoute redirectMessage="Please log in to access your dashboard">
      <Layout user={layoutUser}>
        <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <div className="w-8 h-8 bg-primary-foreground rounded-full"></div>
            </div>
            <p className="text-muted-foreground">Redirecting to your dashboard...</p>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;