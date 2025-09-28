import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { EnhancedCard } from '@/components/EnhancedCard';
import { EnhancedButton } from '@/components/EnhancedButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Star,
  Users,
  ArrowRight,
  Plus,
  Bell,
  AlertCircle,
  Briefcase,
  UserCheck,
  UserX
} from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getAllOpportunities, getProfessorApplications, ProfessorData, OpportunityData, ApplicationData } from '@/lib/database';

const ProfessorDashboard = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useUserProfile();
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Type guard to ensure profile is ProfessorData
  const isProfessorProfile = (profile: ProfessorData | null): profile is ProfessorData => {
    return profile && 'institution' in profile;
  };

  const professorProfile = isProfessorProfile(profile) ? profile : null;

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setLoading(true);
      setError('');

      try {
        // Load opportunities and applications
        const [oppsResult, appsResult] = await Promise.all([
          getAllOpportunities(),
          getProfessorApplications(user.id)
        ]);

        if (oppsResult.error) throw new Error('Failed to load opportunities');
        if (appsResult.error) throw new Error('Failed to load applications');

        // Filter opportunities to only show this professor's
        const professorOpportunities = oppsResult.data?.filter(opp => opp.professor_id === user.id) || [];
        setOpportunities(professorOpportunities);
        setApplications(appsResult.data || []);
      } catch (err) {
        setError((err as Error).message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Calculate real stats
  const dashboardStats = {
    totalOpportunities: opportunities.length,
    activeOpportunities: opportunities.filter(opp => opp.status === 'Open').length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'submitted').length,
    acceptedApplications: applications.filter(app => app.status === 'accepted').length,
    rejectedApplications: applications.filter(app => app.status === 'rejected').length
  };

  const recentApplications = applications
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const recentOpportunities = opportunities
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const layoutUser = user ? {
    name: professorProfile ? `${professorProfile.first_name} ${professorProfile.last_name}` : user.user_metadata?.name || 'Organization',
    role: 'professor' as const,
    avatar: user.user_metadata?.avatar_url
  } : null;

  if (loading) {
    return (
      <ProtectedRoute redirectMessage="Please log in to access your organization dashboard">
        <Layout user={layoutUser}>
          <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="w-8 h-8 bg-primary-foreground rounded-full"></div>
              </div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const calculateProfileCompletion = (professorProfile: ProfessorData) => {
    let completion = 0;
    if (professorProfile?.first_name) completion += 15;
    if (professorProfile?.last_name) completion += 15;
    if (professorProfile?.institution) completion += 20;
    if (professorProfile?.department) completion += 20;
    if (professorProfile?.bio) completion += 20;
    if (professorProfile?.verification_doc_url) completion += 10;
    return completion;
  };

  return (
    <ProtectedRoute redirectMessage="Please log in to access your organization dashboard">
      <Layout user={layoutUser}>
        <div className="min-h-screen bg-gradient-subtle py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome back, <span className="bg-gradient-hero bg-clip-text text-transparent">
                  {professorProfile ? `${professorProfile.first_name} ${professorProfile.last_name}` : user?.user_metadata?.name || 'Professor'}
                </span>
              </h1>
              <p className="text-muted-foreground">Manage your opportunities and review student applications</p>

              {profileError && (
                <Alert className="mt-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="mt-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <EnhancedCard variant="glass" className="text-center">
                <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {dashboardStats.totalOpportunities}
                </div>
                <div className="text-sm text-muted-foreground">Total Opportunities</div>
              </EnhancedCard>

              <EnhancedCard variant="glass" className="text-center">
                <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {dashboardStats.totalApplications}
                </div>
                <div className="text-sm text-muted-foreground">Total Applications</div>
              </EnhancedCard>

              <EnhancedCard variant="glass" className="text-center">
                <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserCheck className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {dashboardStats.acceptedApplications}
                </div>
                <div className="text-sm text-muted-foreground">Accepted</div>
              </EnhancedCard>

              <EnhancedCard variant="glass" className="text-center">
                <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {dashboardStats.pendingApplications}
                </div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </EnhancedCard>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Recent Applications */}
                <EnhancedCard variant="glass" className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Recent Applications</h2>
                    <EnhancedButton variant="outline-hero" size="sm">
                      <Link to="/professor/review-applications" className="flex items-center">
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </EnhancedButton>
                  </div>

                  <div className="space-y-4">
                    {recentApplications.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No applications yet</p>
                      </div>
                    ) : (
                      recentApplications.map((application) => {
                        const opportunity = opportunities.find(opp => opp.id === application.opportunity_id);
                        const statusColors = {
                          'submitted': 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
                          'accepted': 'bg-green-500/10 text-green-700 border-green-500/20',
                          'rejected': 'bg-red-500/10 text-red-700 border-red-500/20',
                          'under_review': 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                        };
                        const statusIcons = {
                          'submitted': <Clock className="w-4 h-4" />,
                          'accepted': <CheckCircle className="w-4 h-4" />,
                          'rejected': <XCircle className="w-4 h-4" />,
                          'under_review': <Clock className="w-4 h-4" />
                        };

                        return (
                          <div key={application.id} className="border border-border/20 rounded-xl p-4 hover:bg-muted/20 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-foreground">
                                {opportunity?.title || 'Opportunity'}
                              </h3>
                              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[application.status] || statusColors.submitted}`}>
                                {statusIcons[application.status] || statusIcons.submitted}
                                <span className="capitalize">{application.status.replace('_', ' ')}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>
                                {application.students?.first_name} {application.students?.last_name} • {application.students?.university || 'University not specified'}
                              </span>
                              <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </EnhancedCard>

                {/* Recent Opportunities */}
                <EnhancedCard variant="glass" className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Your Posted Opportunities</h2>
                    <EnhancedButton variant="outline-hero" size="sm">
                      <Link to="/opportunities" className="flex items-center">
                        Post New
                        <Plus className="w-4 h-4 ml-2" />
                      </Link>
                    </EnhancedButton>
                  </div>

                  <div className="space-y-4">
                    {recentOpportunities.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No opportunities posted yet</p>
                        <EnhancedButton variant="hero" className="mt-4">
                          <Link to="/opportunities">Post Your First Opportunity</Link>
                        </EnhancedButton>
                      </div>
                    ) : (
                      recentOpportunities.map((opportunity) => (
                        <div key={opportunity.id} className="border border-border/20 rounded-xl p-4 hover:bg-muted/20 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">
                                {opportunity.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {opportunity.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span>{opportunity.location || 'Location not specified'}</span>
                                <span>{opportunity.duration || 'Duration not specified'}</span>
                                <span>{opportunity.compensation || 'Compensation not specified'}</span>
                              </div>
                            </div>
                            <div className="ml-4 flex flex-col items-end space-y-2">
                              <Badge variant={opportunity.status === 'Open' ? 'default' : 'secondary'}>
                                {opportunity.status}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {applications.filter(app => app.opportunity_id === opportunity.id).length} applications
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </EnhancedCard>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Quick Actions */}
                <EnhancedCard variant="glass" className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <EnhancedButton
                      variant="hero"
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/opportunities'}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post Opportunity
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline-hero"
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/professor/review-applications'}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review Applications
                    </EnhancedButton>
                    <EnhancedButton
                      variant="glass"
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/profile'}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Update Profile
                    </EnhancedButton>
                  </div>
                </EnhancedCard>

                {/* Application Summary */}
                <EnhancedCard variant="glass" className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Application Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending Review</span>
                      <Badge variant="secondary">{dashboardStats.pendingApplications}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Accepted</span>
                      <Badge variant="default">{dashboardStats.acceptedApplications}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rejected</span>
                      <Badge variant="destructive">{dashboardStats.rejectedApplications}</Badge>
                    </div>

                    {dashboardStats.totalApplications > 0 && (
                      <div className="pt-2 border-t border-border/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">Acceptance Rate</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((dashboardStats.acceptedApplications / dashboardStats.totalApplications) * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={(dashboardStats.acceptedApplications / dashboardStats.totalApplications) * 100}
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                </EnhancedCard>

                {/* Profile Completion */}
                <EnhancedCard variant="glass" className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Profile Strength</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Profile Completion</span>
                        <span className="text-sm text-muted-foreground">
                          {professorProfile ? calculateProfileCompletion(professorProfile) : '0'}%
                        </span>
                      </div>
                      <Progress value={professorProfile ? calculateProfileCompletion(professorProfile) : 0} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">Complete your profile to attract better students:</p>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-center">
                          {professorProfile?.institution ? (
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          ) : (
                            <Plus className="w-3 h-3 text-yellow-500 mr-2" />
                          )}
                          Add institution
                        </li>
                        <li className="flex items-center">
                          {professorProfile?.department ? (
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          ) : (
                            <Plus className="w-3 h-3 text-yellow-500 mr-2" />
                          )}
                          Add department
                        </li>
                        <li className="flex items-center">
                          {professorProfile?.bio ? (
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          ) : (
                            <Plus className="w-3 h-3 text-yellow-500 mr-2" />
                          )}
                          Add bio
                        </li>
                        <li className="flex items-center">
                          {professorProfile?.verification_doc_url ? (
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          ) : (
                            <Plus className="w-3 h-3 text-yellow-500 mr-2" />
                          )}
                          Upload verification documents
                        </li>
                      </ul>
                    </div>
                  </div>
                </EnhancedCard>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ProfessorDashboard;