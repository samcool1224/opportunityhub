import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { EnhancedCard } from '@/components/EnhancedCard';
import { EnhancedButton } from '@/components/EnhancedButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  MapPin,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getAllOpportunities, getStudentApplications, getDailyApplicationCount, getStudentProfile, StudentData } from '@/lib/database';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentData | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [dailyApplicationCount, setDailyApplicationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      setProfileError('');

      try {
        // Load profile, applications, and daily count
        const [profileResult, appsResult, allOppsResult] = await Promise.all([
          getStudentProfile(user.id),
          getStudentApplications(user.id),
          getAllOpportunities()
        ]);

        if (profileResult.error) {
          setProfileError('Failed to load profile');
        } else {
          setProfile(profileResult.data);
        }

        if (appsResult.error) {
          setError('Failed to load applications');
        } else {
          setApplications(appsResult.data || []);
        }

        if (allOppsResult.error) {
          setError('Failed to load opportunities');
        } else {
          setOpportunities(allOppsResult.data || []);
        }

        // Load daily application count
        const { count } = await getDailyApplicationCount(user.id);
        setDailyApplicationCount(count);

      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  const layoutUser = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    role: user.user_metadata?.role || 'student',
    avatar: user.user_metadata?.avatar_url
  } : null;

  const dashboardStats = {
    applicationsSubmitted: applications.length,
    interviewsScheduled: applications.filter(app => app.status === 'under_review').length,
    acceptanceRate: applications.length > 0 ? Math.round((applications.filter(app => app.status === 'accepted').length / applications.length) * 100) : 0,
    dailyApplications: dailyApplicationCount
  };

  // Get recent applications (last 5)
  const recentApplications = applications
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Get recommended opportunities (filter out ones already applied to)
  const appliedOpportunityIds = applications.map(app => app.opportunity_id);
  const recommendedOpportunities = opportunities
    .filter(opp => !appliedOpportunityIds.includes(opp.id))
    .slice(0, 3);

  // Get upcoming deadlines from opportunities (filter to only show ones with deadlines)
  const upcomingDeadlines = opportunities
    .filter(opp => opp.application_deadline)
    .map(opp => {
      const deadline = new Date(opp.application_deadline);
      const now = new Date();
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        opportunity: opp.title,
        professor: opp.professors ? (opp.professors.institution || 'Organization') : 'Organization',
        deadline: opp.application_deadline,
        daysLeft: daysLeft,
        opportunityId: opp.id
      };
    })
    .filter(item => item.daysLeft > 0) // Only show future deadlines
    .sort((a, b) => a.daysLeft - b.daysLeft) // Sort by closest deadline
    .slice(0, 3);

  const calculateStudentProfileCompletion = (profile: StudentData | null) => {
    if (!profile) return 0;
    let completion = 0;
    if (profile?.first_name) completion += 10;
    if (profile?.last_name) completion += 10;
    if (profile?.highoru) completion += 10;
    if (profile?.university) completion += 10;
    if (profile?.major) completion += 10;
    if (profile?.year) completion += 10;
    if (profile?.gpa) completion += 10;
    if (profile?.bio) completion += 10;
    if (profile?.skills && profile.skills.length > 0) completion += 10;
    if (profile?.interests && profile.interests.length > 0) completion += 10;
    return completion;
  };

  const profileCompletion = calculateStudentProfileCompletion(profile);

  if (loading) {
    return (
      <ProtectedRoute redirectMessage="Please log in to access your student dashboard">
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

  return (
    <ProtectedRoute redirectMessage="Please log in to access your student dashboard">
      <Layout user={layoutUser}>
        <div className="min-h-screen bg-gradient-subtle py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome back, <span className="bg-gradient-hero bg-clip-text text-transparent">
                  {profile ? `${profile.first_name} ${profile.last_name}` : user?.user_metadata?.name || 'Student'}
                </span>
              </h1>
              <p className="text-muted-foreground">Track your applications and discover verified and exclusive opportunities</p>
              
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <EnhancedCard variant="glass" className="text-center">
                <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {dashboardStats.applicationsSubmitted}
                </div>
                <div className="text-sm text-muted-foreground">Total Applications</div>
              </EnhancedCard>

              <EnhancedCard variant="glass" className="text-center">
                <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  <span className={dailyApplicationCount >= 5 ? 'text-red-500' : 'text-green-500'}>
                    {dailyApplicationCount}
                  </span>
                  <span className="text-muted-foreground">/5</span>
                </div>
                <div className="text-sm text-muted-foreground">Today's Applications</div>
              </EnhancedCard>

              <EnhancedCard variant="glass" className="text-center">
                <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {dashboardStats.interviewsScheduled}
                </div>
                <div className="text-sm text-muted-foreground">Under Review</div>
              </EnhancedCard>

              <EnhancedCard variant="glass" className="text-center">
                <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {dashboardStats.acceptanceRate}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
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
                      <Link to="/student/applications" className="flex items-center">
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
                        <EnhancedButton variant="hero" className="mt-4">
                          <Link to="/opportunities">Browse Opportunities</Link>
                        </EnhancedButton>
                      </div>
                    ) : (
                      recentApplications.map((application) => {
                        const opportunity = application.opportunities;
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
                                {opportunity?.professors?.institution || 'Organization not specified'}
                              </span>
                              <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </EnhancedCard>

                {/* Recommended Opportunities */}
                <EnhancedCard variant="glass" className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Recommended for You</h2>
                    <EnhancedButton variant="outline-hero" size="sm">
                      <Link to="/opportunities" className="flex items-center">
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </EnhancedButton>
                  </div>

                  <div className="space-y-6">
                    {recommendedOpportunities.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No new opportunities available</p>
                        <p className="text-sm">You've applied to all available opportunities</p>
                      </div>
                    ) : (
                      recommendedOpportunities.map((opportunity) => (
                        <div key={opportunity.id} className="border border-border/20 rounded-xl p-4 hover:bg-muted/20 transition-colors">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                              {(opportunity.professors?.first_name?.[0] || 'P')}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">
                                <Link to={`/opportunities/${opportunity.id}`} className="hover:text-primary transition-colors">
                                  {opportunity.title}
                                </Link>
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {opportunity.professors?.institution || 'Organization not specified'}
                              </p>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {opportunity.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {(opportunity.tags || []).slice(0, 3).map((tag: string, tagIndex: number) => (
                                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span>{opportunity.location || 'Location not specified'}</span>
                                  <span>{opportunity.duration || 'Duration not specified'}</span>
                                  <span>{opportunity.compensation || 'Compensation not specified'}</span>
                                </div>
                                <EnhancedButton variant="hero" size="sm">
                                  <Link to={"/opportunities"}>
                                    Apply Now
                                  </Link>
                                </EnhancedButton>
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
                      <Search className="w-4 h-4 mr-2" />
                      Browse Opportunities
                    </EnhancedButton>
                    <EnhancedButton 
                      variant="outline-hero" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/profile'}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Update Profile
                    </EnhancedButton>
                    <EnhancedButton 
                      variant="glass" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/student/applications'}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Applications
                    </EnhancedButton>
                  </div>
                </EnhancedCard>

                {/* Application Deadlines */}
                <EnhancedCard variant="glass" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-foreground">Upcoming Deadlines</h3>
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-4">
                    {upcomingDeadlines.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">No upcoming deadlines</p>
                      </div>
                    ) : (
                      upcomingDeadlines.map((item, index) => (
                        <div key={index} className="border border-border/20 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-foreground text-sm">{item.opportunity}</h4>
                            <Badge 
                              variant={item.daysLeft <= 7 ? 'destructive' : item.daysLeft <= 14 ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {item.daysLeft}d left
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.professor} • {new Date(item.deadline).toLocaleDateString()}
                          </div>
                        </div>
                      ))
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
                          {profileCompletion}%
                        </span>
                      </div>
                      <Progress value={profileCompletion} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">Complete your profile to get better matches:</p>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          Add portfolio projects
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          Upload resume
                        </li>
                        <li className="flex items-center">
                          <Plus className="w-3 h-3 text-yellow-500 mr-2" />
                          Add more skills
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

export default StudentDashboard;