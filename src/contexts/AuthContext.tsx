import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, role: 'student' | 'professor', name?: string) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);
    console.log('AuthContext: useEffect started');

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthContext: Initial session:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('AuthContext: Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthContext: onAuthStateChange event:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          // Update email_confirmed status when user logs in after confirming email
          try {
            const role = session.user.user_metadata?.role;
            if (role === 'student') {
              supabase
                .from('students')
                .update({ email_confirmed: true })
                .eq('id', session.user.id)
                .then(({ error }) => {
                  if (error) console.error('Failed to update student email confirmation status:', error);
                });
            } else if (role === 'professor') {
              supabase
                .from('professors')
                .update({ email_confirmed: true })
                .eq('id', session.user.id)
                .then(({ error }) => {
                  if (error) console.error('Failed to update professor email confirmation status:', error);
                });
            }
          } catch (e) {
            console.warn('Error updating email confirmation status:', e);
          }
        }
      }
    );

    return () => {
      console.log('AuthContext: useEffect cleanup, unsubscribing from auth state changes.');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, role: 'student' | 'professor', name?: string) => {
    try {
      console.log('Attempting signup for:', email, 'with role:', role)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
          data: {
            role,
            name: name || '',
          }
        }
      })

      if (error) {
        console.error('Supabase signup error:', error)
        
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          return { data, error: { ...error, message: 'An account with this email already exists. Please try logging in instead.' } }
        }
        
        if (error.message.includes('Password')) {
          return { data, error: { ...error, message: 'Password must be at least 6 characters long and contain a mix of letters and numbers.' } }
        }
        
        if (error.message.includes('Email')) {
          return { data, error: { ...error, message: 'Please enter a valid email address.' } }
        }
      }

      console.log('Signup successful:', data)
      return { data, error }
    } catch (err) {
      console.error('Unexpected signup error:', err)
      return { data: null, error: { message: 'An unexpected error occurred. Please try again.' } }
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    try {
      console.log('Signing out user...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error during sign out:', error)
        // Force clear local state even if Supabase signout fails
        setUser(null)
        setSession(null)
        setLoading(false)
      } else {
        console.log('Sign out successful')
      }
      
      // Clear any additional stored data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token')
        sessionStorage.clear()
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error)
      // Force clear local state
      setUser(null)
      setSession(null)
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}