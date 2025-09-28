import { useEffect, useState } from 'react'
import { Layout } from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { EnhancedCard } from '@/components/EnhancedCard'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Calendar, MapPin, Clock, DollarSign, Building, Award, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getStudentApplications } from '@/lib/database'

const StudentApplications = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError('')
      try {
        console.log('Loading applications for user:', user.id);
        const { data, error } = await getStudentApplications(user.id)
        
        if (error) {
          console.error('Error loading applications:', error);
          setError('Failed to load applications: ' + (error.message || error));
        } else {
          console.log('Applications loaded successfully:', data);
          setApplications(data || [])
        }
      } catch (err: any) {
        console.error('Exception loading applications:', err);
        setError(err.message || 'Failed to load applications')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/10 text-green-700 border-green-500/20'
      case 'rejected':
        return 'bg-red-500/10 text-red-700 border-red-500/20'
      case 'under_review':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20'
      default:
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      case 'under_review':
        return <ClockIcon className="h-4 w-4" />
      default:
        return <ClockIcon className="h-4 w-4" />
    }
  }

  const layoutUser = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    role: user.user_metadata?.role || 'student',
    avatar: user.user_metadata?.avatar_url
  } : null

  if (loading) {
    return (
      <ProtectedRoute redirectMessage="Please log in to view your applications">
        <Layout user={layoutUser}>
          <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="w-8 h-8 bg-primary-foreground rounded-full"></div>
              </div>
              <p className="text-muted-foreground">Loading your applications...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute redirectMessage="Please log in to view your applications">
      <Layout user={layoutUser}>
        <div className="min-h-screen bg-gradient-subtle py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">My Applications</h1>
              <p className="text-muted-foreground">Track the status of your opportunity applications</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {applications.length === 0 ? (
              <EnhancedCard variant="glass" className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground mb-4">You haven't applied to any research opportunities yet.</p>
                <a href="/opportunities" className="text-primary hover:text-primary-light transition-colors">
                  Browse Opportunities
                </a>
              </EnhancedCard>
            ) : (
              <div className="space-y-6">
                {applications.map((application) => {
                  console.log('Full Application data:', JSON.stringify(application, null, 2));
                  console.log('Opportunity data:', application.opportunities);
                  console.log('Professor data:', application.opportunities?.professors);
                  
                  // Access professor data correctly from the nested structure
                  const professor = application.opportunities?.professors;
                  const opportunity = application.opportunities;
                  
                  return (
                    <EnhancedCard key={application.id} variant="glass" className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {opportunity?.title || 'Opportunity Title Not Available'}
                        </h3>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            <span>{professor?.institution || 'Institution not specified'}</span>
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            <span>{professor?.department || 'Department not specified'}</span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">
                          {opportunity?.description || 'No description available'}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{opportunity?.location || 'Location not specified'}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{opportunity?.duration || 'Duration not specified'}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span>{opportunity?.compensation || 'Compensation not specified'}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {application.message && (
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <p className="text-sm"><strong>Your Message:</strong></p>
                            <p className="text-sm text-muted-foreground">{application.message}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex flex-col items-end space-y-3">
                        <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status.replace('_', ' ')}</span>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {professor?.institution || 'Organization not available'}
                          </p>
                          <p className="text-xs text-muted-foreground">Organization</p>
                        </div>
                      </div>
                    </div>
                  </EnhancedCard>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

export default StudentApplications
