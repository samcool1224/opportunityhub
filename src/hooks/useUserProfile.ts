import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getStudentProfile, getProfessorProfile, StudentData, ProfessorData } from '@/lib/database'

export const useUserProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<StudentData | ProfessorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const role = user.user_metadata?.role

        if (role === 'student') {
          const { data, error } = await getStudentProfile(user.id)
          if (error) {
            setError('Failed to load student profile')
            console.error('Error fetching student profile:', error)
          } else {
            setProfile(data)
          }
        } else if (role === 'professor') {
          const { data, error } = await getProfessorProfile(user.id)
          if (error) {
            setError('Failed to load professor profile')
            console.error('Error fetching professor profile:', error)
          } else {
            setProfile(data)
          }
        }
      } catch (err) {
        setError('An unexpected error occurred')
        console.error('Profile fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const refreshProfile = async () => {
    if (user) {
      setLoading(true)
      const role = user.user_metadata?.role

      try {
        if (role === 'student') {
          const { data, error } = await getStudentProfile(user.id)
          if (!error && data) {
            setProfile(data)
          }
        } else if (role === 'professor') {
          const { data, error } = await getProfessorProfile(user.id)
          if (!error && data) {
            setProfile(data)
          }
        }
      } catch (err) {
        console.error('Error refreshing profile:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  return {
    profile,
    loading,
    error,
    refreshProfile,
    userRole: user?.user_metadata?.role as 'student' | 'professor' | undefined
  }
}