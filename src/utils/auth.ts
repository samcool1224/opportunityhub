import { supabase } from '@/lib/supabase'

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor';
  avatar?: string;
}

// Get current user profile from Supabase
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    // Get user profile from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !profile) {
      console.error('Error fetching profile:', error)
      return null
    }

    return {
      id: profile.id,
      name: profile.name || user.email?.split('@')[0] || 'User',
      email: profile.email,
      role: profile.role,
      avatar: profile.avatar_url || undefined
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  } catch {
    return false
  }
}

// Get dashboard path based on user role
export const getDashboardPath = (user: User): string => {
  return user.role === 'student' ? '/student/dashboard' : '/professor/dashboard';
}

// Clear current user (logout)
export const clearCurrentUser = async (): Promise<void> => {
  await supabase.auth.signOut()
}

// Mock user data for fallback (keeping for compatibility)
export const mockCurrentUser = {
  student: {
    name: 'Alex Johnson',
    role: 'student' as const,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  professor: {
    name: 'Dr. Sarah Chen',
    role: 'professor' as const,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  }
};