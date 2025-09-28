import { supabase } from '@/lib/supabase'

// Simple test function to check if basic signup works
export const testSignup = async (email: string, password: string) => {
  try {
    console.log('Testing signup with:', { email, password: '***' })
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    console.log('Signup result:', { data, error })
    
    if (error) {
      console.error('Signup error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      })
    }

    return { data, error }
  } catch (err) {
    console.error('Unexpected error during signup:', err)
    return { data: null, error: err }
  }
}

// Test function with metadata
export const testSignupWithMetadata = async (email: string, password: string, role: string, name: string) => {
  try {
    console.log('Testing signup with metadata:', { email, role, name, password: '***' })
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          name,
        }
      }
    })

    console.log('Signup with metadata result:', { data, error })
    
    if (error) {
      console.error('Signup error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      })
    }

    return { data, error }
  } catch (err) {
    console.error('Unexpected error during signup with metadata:', err)
    return { data: null, error: err }
  }
}