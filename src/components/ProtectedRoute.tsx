import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectMessage?: string;
}

export const ProtectedRoute = ({ 
  children, 
  redirectMessage = "Please log in to access this page" 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [approvalChecked, setApprovalChecked] = useState(false);
  const [approvalError, setApprovalError] = useState<string>('');

  useEffect(() => {
    console.log('ProtectedRoute: useEffect triggered', { loading, user: user?.email });

    if (loading) {
      console.log('ProtectedRoute: Auth is loading...');
      return; // Wait for auth to finish loading
    }

    if (!user) {
      console.log('ProtectedRoute: No user found, redirecting to login.');
      navigate(`/login?message=${encodeURIComponent(redirectMessage)}`);
      return;
    }

    console.log('ProtectedRoute: User found, checking approval status...');
    const verifyApproval = async () => {
      const role = user.user_metadata?.role;
      console.log(`ProtectedRoute: User role: ${role}`);

      if (role === 'student') {
        const { data, error } = await supabase
          .from('students')
          .select('email_confirmed')
          .eq('id', user.id)
          .single();

        if (error) {
          setApprovalError('There was an error checking your account status.');
        } else if (!data?.email_confirmed) {
          navigate(`/login?message=${encodeURIComponent('Please check your email and confirm your account before accessing this page.')}`);
        }
      } else if (role === 'professor') {
        const { data, error } = await supabase
          .from('professors')
          .select('approved, email_confirmed')
          .eq('id', user.id)
          .single();

        if (error) {
          setApprovalError('There was an error checking your account approval status.');
        } else if (!data?.email_confirmed) {
          navigate(`/login?message=${encodeURIComponent('Please check your email and confirm your account before accessing this page.')}`);
        } else if (!data?.approved) {
          navigate(`/login?message=${encodeURIComponent('Your account is awaiting approval. We manually approve all professor accounts within 3 business days.')}`);
        }
      }
      setApprovalChecked(true);
      console.log('ProtectedRoute: Approval check complete.');
    };

    verifyApproval();

  }, [user, loading, navigate, redirectMessage]);

  if (loading || (!approvalChecked && user)) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-primary-foreground rounded-full"></div>
          </div>
          <p className="text-muted-foreground">Checking authentication...</p>
          {approvalError && (
            <p className="text-destructive mt-2 text-sm">{approvalError}</p>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    // This should not be reached due to the redirect in useEffect, but it's a good fallback.
    console.log('ProtectedRoute: Render check - no user, returning null.');
    return null;
  }

  console.log('ProtectedRoute: Render check - user found, rendering children.');
  return <>{children}</>;
};