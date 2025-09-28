import { supabase } from './supabase'

// Function to clean up unconfirmed accounts older than 24 hours
export const cleanupUnconfirmedAccounts = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    // Delete unconfirmed students older than 24 hours
    const { error: studentError } = await supabase
      .from('students')
      .delete()
      .lt('created_at', twentyFourHoursAgo)
      .eq('email_confirmed', false)
    
    if (studentError) {
      console.error('Error cleaning up unconfirmed students:', studentError)
    }
    
    // Delete unconfirmed professors older than 24 hours
    const { error: professorError } = await supabase
      .from('professors')
      .delete()
      .lt('created_at', twentyFourHoursAgo)
      .eq('email_confirmed', false)
    
    if (professorError) {
      console.error('Error cleaning up unconfirmed professors:', professorError)
    }
    
    // Also delete the corresponding auth users
    // Note: This requires a server-side function or admin privileges
    // For now, we'll just clean up the profile data
    
    console.log('Cleanup completed successfully')
  } catch (error) {
    console.error('Error during cleanup:', error)
  }
}

// Function to schedule cleanup (can be called from a cron job or serverless function)
export const scheduleCleanup = () => {
  // Run cleanup every hour
  setInterval(cleanupUnconfirmedAccounts, 60 * 60 * 1000)
  
  // Also run cleanup immediately
  cleanupUnconfirmedAccounts()
}
