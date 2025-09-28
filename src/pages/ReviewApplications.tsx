import { useEffect, useState } from 'react'
import { Layout } from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { EnhancedCard } from '@/components/EnhancedCard'
import { EnhancedButton } from '@/components/EnhancedButton'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Users, Calendar, MapPin, Clock, DollarSign, Building, Award, CheckCircle, XCircle, Eye, Download, Linkedin, Globe, GraduationCap, BookOpen, Github } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getAllOpportunities, getProfessorApplications, updateApplicationStatus, createNotification, OpportunityData, ApplicationData } from '@/lib/database'

const ReviewApplications = () => {
  const { user } = useAuth()
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([])
  const [applications, setApplications] = useState<ApplicationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError('')
      try {
        // Load all opportunities for this professor
        const { data: oppsData, error: oppsError } = await getAllOpportunities()
        if (oppsError) throw new Error('Failed to load opportunities')
        
        // Filter to only show opportunities from this professor
        const professorOpportunities = oppsData?.filter(opp => opp.professor_id === user.id) || []
        setOpportunities(professorOpportunities)
        
        // Load all applications for this professor
        const { data: appsData, error: appsError } = await getProfessorApplications(user.id)
        if (appsError) throw new Error('Failed to load applications')
        setApplications(appsData || [])
        
        // Set first opportunity as selected by default
        if (professorOpportunities.length > 0) {
          setSelectedOpportunity(professorOpportunities[0].id)
        }
      } catch (err) {
        setError((err as Error).message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const refreshApplications = async () => {
    if (!user) return
    const { data } = await getProfessorApplications(user.id)
    setApplications(data || [])
  }

  const getApplicationsForOpportunity = (opportunityId: string) => {
    return applications.filter(app => app.opportunity_id === opportunityId)
  }

  const handleApplicationAction = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      const application = applications.find(app => app.id === applicationId)
      if (!application) return

      await updateApplicationStatus(applicationId, status)
      
      // Send notification to student
      await createNotification({
        user_id: application.student_id,
        title: `Application ${status === 'accepted' ? 'Accepted' : 'Rejected'}`,
        body: `Your application for "${application.opportunities?.title}" was ${status}.`,
        data: { applicationId, status }
      })

      // Refresh applications
      await refreshApplications()
    } catch (err) {
      setError('Failed to update application status')
    }
  }

  const layoutUser = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    role: user.user_metadata?.role || 'professor',
    avatar: user.user_metadata?.avatar_url
  } : null

  const formatUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  if (loading) {
    return (
      <ProtectedRoute redirectMessage="Please log in to access your applications">
        <Layout user={layoutUser}>
          <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="w-8 h-8 bg-primary-foreground rounded-full"></div>
              </div>
              <p className="text-muted-foreground">Loading applications...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute redirectMessage="Please log in to access your applications">
      <Layout user={layoutUser}>
        <div className="min-h-screen bg-gradient-subtle py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Review Applications</h1>
              <p className="text-muted-foreground">Manage and review student applications for your posted opportunities</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {opportunities.length === 0 ? (
              <EnhancedCard variant="glass" className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No Opportunities Posted</h3>
                <p className="text-muted-foreground mb-4">You haven't posted any opportunities yet.</p>
                <EnhancedButton variant="hero">
                  <a href="/opportunities">Post Your First Opportunity</a>
                </EnhancedButton>
              </EnhancedCard>
            ) : (
              <div className="space-y-8">
                {opportunities.map((opportunity) => {
                  const opportunityApplications = getApplicationsForOpportunity(opportunity.id)
                  const isSelected = selectedOpportunity === opportunity.id
                  
                  return (
                    <EnhancedCard key={opportunity.id} variant="glass" className="p-6">
                      {/* Opportunity Header */}
                      <div 
                        className="flex items-center justify-between cursor-pointer mb-4"
                        onClick={() => setSelectedOpportunity(isSelected ? null : opportunity.id)}
                      >
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2">{opportunity.title}</h3>
                          <p className="text-muted-foreground line-clamp-2 mb-3">{opportunity.description}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{opportunity.location || 'Location not specified'}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{opportunity.duration || 'Duration not specified'}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span>{opportunity.compensation || 'Compensation not specified'}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{opportunityApplications.length} applications</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge variant={opportunity.status === 'Open' ? 'default' : 'secondary'}>
                            {opportunity.status}
                          </Badge>
                          <Badge variant="outline">
                            {opportunity.type || 'Remote'}
                          </Badge>
                        </div>
                      </div>

                      {/* Applications Section */}
                      {isSelected && (
                        <div className="border-t border-border/20 pt-6">
                          <h4 className="text-lg font-semibold mb-4 flex items-center">
                            <Eye className="h-5 w-5 mr-2" />
                            Applications ({opportunityApplications.length})
                          </h4>
                          
                          {opportunityApplications.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>No applications yet for this opportunity</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {opportunityApplications.map((application) => (
                                <div key={application.id} className="border border-border/20 rounded-xl p-4 bg-muted/20">
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                          {application.students?.first_name?.[0] || 'S'}
                                        </div>
                                        <div>
                                          <h5 className="font-semibold text-foreground">
                                            {application.students?.first_name} {application.students?.last_name}
                                          </h5>
                                          <p className="text-sm text-muted-foreground">{application.students?.email}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <p><strong>University:</strong> {application.students?.university || 'Not specified'}</p>
                                          <p><strong>Major:</strong> {application.students?.major || 'Not specified'}</p>
                                          <p><strong>Year:</strong> {application.students?.year || 'Not specified'}</p>
                                        </div>
                                        <div>
                                          <p><strong>GPA:</strong> {application.students?.gpa || 'Not specified'}</p>
                                          <p><strong>Skills:</strong> {(application.students?.skills || []).slice(0, 3).join(', ')}</p>
                                          <p><strong>Interests:</strong> {(application.students?.interests || []).slice(0, 2).join(', ')}</p>
                                        </div>
                                      </div>
                                      
                                      {application.students?.bio && (
                                        <div className="mt-3">
                                          <p className="text-sm"><strong>Bio:</strong></p>
                                          <p className="text-sm text-muted-foreground">{application.students.bio}</p>
                                        </div>
                                      )}
                                      
                                      {/* Portfolio/Resume Download */}
                                      {application.students?.portfolio_url && (
                                        <div className="mt-3">
                                          <p className="text-sm"><strong>Portfolio/Resume:</strong></p>
                                          <a 
                                            href={application.students.portfolio_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                                          >
                                            <Download className="h-4 w-4 mr-1" />
                                            Download {application.students.portfolio_filename || 'Portfolio'}
                                          </a>
                                        </div>
                                      )}
                                      
                                      {/* Important Links */}
                                      {application.students?.links && Object.values(application.students.links).some(link => link) && (
                                        <div className="mt-3">
                                          <p className="text-sm"><strong>Important Links:</strong></p>
                                          <div className="flex flex-wrap gap-2 mt-1">
                                            {application.students.links.linkedin && (
                                              <a 
                                                href={formatUrl(application.students.links.linkedin)} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                                              >
                                                <Linkedin className="h-3 w-3 mr-1" />
                                                LinkedIn
                                              </a>
                                            )}
                                            {application.students.links.personal_website && (
                                              <a 
                                                href={formatUrl(application.students.links.personal_website)} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors"
                                              >
                                                <Globe className="h-3 w-3 mr-1" />
                                                Website
                                              </a>
                                            )}
                                            {application.students.links.google_scholar && (
                                              <a 
                                                href={formatUrl(application.students.links.google_scholar)} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
                                              >
                                                <GraduationCap className="h-3 w-3 mr-1" />
                                                Scholar
                                              </a>
                                            )}
                                            {application.students.links.github && (
                                              <a 
                                                href={formatUrl(application.students.links.github)} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-900 transition-colors"
                                              >
                                                <Github className="h-3 w-3 mr-1" />
                                                GitHub
                                              </a>
                                            )}
                                            {application.students.links.researchgate && (
                                              <a 
                                                href={formatUrl(application.students.links.researchgate)} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-xs bg-teal-600 text-white px-2 py-1 rounded hover:bg-teal-700 transition-colors"
                                              >
                                                <BookOpen className="h-3 w-3 mr-1" />
                                                ResearchGate
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      
                                      {application.message && (
                                        <div className="mt-3 p-3 bg-background rounded-lg">
                                          <p className="text-sm"><strong>Student Message:</strong></p>
                                          <p className="text-sm text-muted-foreground">{application.message}</p>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="ml-4 flex flex-col space-y-2">
                                      <Badge 
                                        variant={
                                          application.status === 'accepted' ? 'default' : 
                                          application.status === 'rejected' ? 'destructive' : 
                                          application.status === 'under_review' ? 'secondary' : 'outline'
                                        }
                                        className="text-xs"
                                      >
                                        {application.status}
                                      </Badge>
                                      
                                      {application.status === 'submitted' && (
                                        <div className="flex flex-col space-y-2">
                                          <EnhancedButton 
                                            variant="outline-hero" 
                                            size="sm"
                                            onClick={() => handleApplicationAction(application.id, 'under_review')}
                                          >
                                            <Eye className="h-3 w-3 mr-1" />
                                            Review
                                          </EnhancedButton>
                                          <EnhancedButton 
                                            variant="hero" 
                                            size="sm"
                                            onClick={() => handleApplicationAction(application.id, 'accepted')}
                                          >
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Accept
                                          </EnhancedButton>
                                          <EnhancedButton 
                                            variant="outline-hero" 
                                            size="sm"
                                            onClick={() => handleApplicationAction(application.id, 'rejected')}
                                          >
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Reject
                                          </EnhancedButton>
                                        </div>
                                      )}
                                      
                                      {application.status === 'under_review' && (
                                        <div className="flex flex-col space-y-2">
                                          <EnhancedButton 
                                            variant="hero" 
                                            size="sm"
                                            onClick={() => handleApplicationAction(application.id, 'accepted')}
                                          >
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Accept
                                          </EnhancedButton>
                                          <EnhancedButton 
                                            variant="outline-hero" 
                                            size="sm"
                                            onClick={() => handleApplicationAction(application.id, 'rejected')}
                                          >
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Reject
                                          </EnhancedButton>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="text-xs text-muted-foreground">
                                    Applied: {new Date(application.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </EnhancedCard>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

export default ReviewApplications
