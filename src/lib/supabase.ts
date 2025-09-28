import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rfjtyglwvqgigipudxrc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmanR5Z2x3dnFnaWdpcHVkeHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MjYyODIsImV4cCI6MjA3MTIwMjI4Mn0.9cWlI4AH6ftRbKY1qqT7ZDEuI4FZ4KqRgEqt0akQuis'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use localStorage for session persistence
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    // Auto refresh tokens
    autoRefreshToken: true,
    // Persist session across browser tabs
    persistSession: true,
    // Detect session in URL (for email confirmations)
    detectSessionInUrl: true,
    // Flow type for authentication
    flowType: 'pkce'
  }
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'student' | 'professor'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role: 'student' | 'professor'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'student' | 'professor'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          highoru: 'high school' | 'university' | null
          university: string | null
          major: string | null
          year: string | null
          gpa: string | null
          bio: string | null
          skills: string[] | null
          interests: string[] | null
          portfolio_url: string | null
          portfolio_filename: string | null
          links: {
            linkedin?: string
            personal_website?: string
            google_scholar?: string
            github?: string
            researchgate?: string
            [key: string]: string | undefined
          } | null
          email_confirmed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          highoru?: 'high school' | 'university' | null
          university?: string | null
          major?: string | null
          year?: string | null
          gpa?: string | null
          bio?: string | null
          skills?: string[] | null
          interests?: string[] | null
          portfolio_url?: string | null
          portfolio_filename?: string | null
          links?: {
            linkedin?: string
            personal_website?: string
            google_scholar?: string
            github?: string
            researchgate?: string
            [key: string]: string | undefined
          } | null
          email_confirmed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          highoru?: 'high school' | 'university' | null
          university?: string | null
          major?: string | null
          year?: string | null
          gpa?: string | null
          bio?: string | null
          skills?: string[] | null
          interests?: string[] | null
          portfolio_url?: string | null
          portfolio_filename?: string | null
          links?: {
            linkedin?: string
            personal_website?: string
            google_scholar?: string
            github?: string
            researchgate?: string
            [key: string]: string | undefined
          } | null
          email_confirmed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      professors: {
        Row: {
          id: string
          title: string | null
          first_name: string
          last_name: string
          email: string
          institution: string | null
          department: string | null
          position: string | null
          bio: string | null
          website: string | null
          orcid: string | null
          publications: string | null
          research_areas: string[] | null
          verification_doc_url: string | null
          verification_doc_filename: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title?: string | null
          first_name: string
          last_name: string
          email: string
          institution?: string | null
          department?: string | null
          position?: string | null
          bio?: string | null
          website?: string | null
          orcid?: string | null
          publications?: string | null
          research_areas?: string[] | null
          verification_doc_url?: string | null
          verification_doc_filename?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string | null
          first_name?: string
          last_name?: string
          email?: string
          institution?: string | null
          department?: string | null
          position?: string | null
          bio?: string | null
          website?: string | null
          orcid?: string | null
          publications?: string | null
          research_areas?: string[] | null
          verification_doc_url?: string | null
          verification_doc_filename?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}