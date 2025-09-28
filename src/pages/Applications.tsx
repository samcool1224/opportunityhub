import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Applications = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Wait for user data to be loaded

    if (!user) {
      navigate('/login?message=Please log in to view your applications.');
      return;
    }

    if (user.user_metadata?.role === 'student') {
      navigate('/student/applications');
    } else if (user.user_metadata?.role === 'professor') {
      navigate('/professor/review-applications');
    } else {
      // Fallback for unknown roles
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return null; // This component will only handle redirection
};

export default Applications;
