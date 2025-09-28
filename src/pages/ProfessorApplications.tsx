import { useEffect, useState } from 'react'
import { Layout } from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { EnhancedCard } from '@/components/EnhancedCard'
import { EnhancedButton } from '@/components/EnhancedButton'
import { useAuth } from '@/contexts/AuthContext'
import { getProfessorApplications, updateApplicationStatus, createNotification, ApplicationData } from '@/lib/database'

const ProfessorApplications = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState<ApplicationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError('')
      const { data, error } = await getProfessorApplications(user.id)
      if (error) setError('Failed to load applications')
      else setApplications(data || [])
      setLoading(false)
    }
    load()
  }, [user])

  const refresh = async () => {
    if (!user) return
    const { data } = await getProfessorApplications(user.id)
    setApplications(data || [])
  }

  const layoutUser = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    role: user.user_metadata?.role || 'professor',
    avatar: user.user_metadata?.avatar_url
  } : null

  return (
    <ProtectedRoute redirectMessage="Please log in to access your organization applications">
      <Layout user={layoutUser}>
        <div className="min-h-screen bg-gradient-subtle py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-6">Applications</h1>
            {error && <p className="text-destructive mb-4">{error}</p>}
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <EnhancedCard key={app.id} variant="glass" className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">{app.opportunities?.title || 'Opportunity'}</h3>
                        <p className="text-sm text-muted-foreground mb-2">Status: {app.status}</p>
                        <div className="text-sm">
                          <p><strong>Student:</strong> {app.students?.first_name} {app.students?.last_name} ({app.students?.email})</p>
                          <p><strong>University:</strong> {app.students?.university} | <strong>Major:</strong> {app.students?.major}</p>
                          {app.message && <p className="mt-2">Message: {app.message}</p>}
                        </div>
                      </div>
                      <div className="space-x-2">
                        <EnhancedButton variant="outline-hero" onClick={async () => {
                          await updateApplicationStatus(app.id, 'under_review')
                          await refresh()
                        }}>Under Review</EnhancedButton>
                        <EnhancedButton variant="hero" onClick={async () => {
                          await updateApplicationStatus(app.id, 'accepted')
                          await createNotification({
                            user_id: app.student_id,
                            title: 'Application Accepted',
                            body: `Your application for "${app.opportunities?.title}" was accepted.`,
                            data: { applicationId: app.id }
                          })
                          await refresh()
                        }}>Accept</EnhancedButton>
                        <EnhancedButton variant="outline-hero" onClick={async () => {
                          await updateApplicationStatus(app.id, 'rejected')
                          await createNotification({
                            user_id: app.student_id,
                            title: 'Application Rejected',
                            body: `Your application for "${app.opportunities?.title}" was rejected.`,
                            data: { applicationId: app.id }
                          })
                          await refresh()
                        }}>Reject</EnhancedButton>
                      </div>
                    </div>
                  </EnhancedCard>
                ))}
                {applications.length === 0 && (
                  <EnhancedCard variant="glass" className="p-6 text-center text-muted-foreground">No applications yet.</EnhancedCard>
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

export default ProfessorApplications


