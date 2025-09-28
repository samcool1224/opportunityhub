import { useState, useEffect } from 'react';
import { User } from '@/utils/auth';
import { getCurrentUser } from '@/utils/auth';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthUser = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuthUser: useEffect triggered', { authLoading, authUser: authUser?.email });

    if (authLoading) {
      console.log('useAuthUser: Auth is loading...');
      setLoading(true);
      return;
    }

    if (!authUser) {
      console.log('useAuthUser: No auth user found.');
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      console.log('useAuthUser: Fetching user profile...');
      try {
        const currentUser = await getCurrentUser();
        console.log('useAuthUser: User profile fetched:', currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error('useAuthUser: Error getting user profile:', error);
        setUser(null);
      } finally {
        setLoading(false);
        console.log('useAuthUser: Finished fetching profile.');
      }
    };

    fetchUserProfile();

  }, [authUser, authLoading]);

  return { user, loading };
};