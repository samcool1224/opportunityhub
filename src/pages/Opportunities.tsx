import { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { EnhancedCard } from '@/components/EnhancedCard';
import { EnhancedButton } from '@/components/EnhancedButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users,
  Calendar,
  Award,
  Building,
  Download,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getAllOpportunities, createOpportunity, applyToOpportunity, getStudentApplications, getDailyApplicationCount } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

import { OpportunityData, ApplicationData } from '@/lib/database';

const Opportunities = () => {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newOpp, setNewOpp] = useState({
    title: '',
    description: '',
    tags: '',
    location: '',
    duration: '',
    compensation: '',
    type: 'Remote' as 'Remote' | 'On-site' | 'Hybrid',
    application_deadline: '',
    applicant_cap: '',
    opportunity_link: '',
    app_link: ''
  });
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [dailyApplicationCount, setDailyApplicationCount] = useState(0);
  const [visibleOpportunities, setVisibleOpportunities] = useState(5);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});

  const toggleDescription = (opportunityId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [opportunityId]: !prev[opportunityId]
    }));
  };

  // Filter opportunities based on search query
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opportunity => {
      const matchesSearch = searchQuery === '' || 
        opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opportunity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opportunity.tags || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        `${opportunity.professors?.first_name} ${opportunity.professors?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [opportunities, searchQuery]);

  useEffect(() => {
    const load = async () => {
      if (!authUser) return;
      setLoading(true);
      setError('');
      
      try {
        // Load opportunities and applications
        const [oppsResult, appsResult] = await Promise.all([
          getAllOpportunities(),
          getStudentApplications(authUser.id)
        ]);

        if (oppsResult.error) throw new Error('Failed to load opportunities');
        if (appsResult.error) throw new Error('Failed to load applications');

        setOpportunities(oppsResult.data || []);
        setApplications(appsResult.data || []);

        // Load daily application count for students
        if (authUser.user_metadata?.role === 'student') {
          const { count } = await getDailyApplicationCount(authUser.id);
          setDailyApplicationCount(count);
        }
      } catch (err) {
        setError((err as Error).message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authUser]);

  const handleApply = async (opportunityId: string, professorId: string) => {
    if (!authUser) return;
    
    try {
      const { error } = await applyToOpportunity({
        opportunityId,
        studentId: authUser.id,
        professorId,
      });
      
      if (error) {
        setError(error.message);
      } else {
        // Reload applications and daily count
        const [appsResult] = await Promise.all([
          getStudentApplications(authUser.id)
        ]);
        
        if (appsResult.data) {
          setApplications(appsResult.data);
        }

        if (authUser.user_metadata?.role === 'student') {
          const { count } = await getDailyApplicationCount(authUser.id);
          setDailyApplicationCount(count);
        }
        
        // Show success message
        alert('Application submitted successfully!');
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to apply');
    }
  };

  const isCapReached = (opportunity: OpportunityData) => {
    if (!opportunity.cap_reached_at) return false;
    
    const capReachedDate = new Date(opportunity.cap_reached_date);
    const currentDate = new Date();
    const daysSinceCapReached = Math.floor((currentDate.getTime() - capReachedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Keep showing for 7 days after cap is reached
    return daysSinceCapReached <= 7;
  };

  const hasApplied = (opportunityId: string) => {
    return applications.some(app => app.opportunity_id === opportunityId);
  };

  const getApplicationStatus = (opportunity: OpportunityData) => {
    if (opportunity.cap_reached_at && isCapReached(opportunity)) {
      return 'cap_reached';
    }
    if (hasApplied(opportunity.id)) {
      return 'applied';
    }
    if (authUser?.user_metadata?.role === 'student' && dailyApplicationCount >= 5) {
      return 'daily_limit_reached';
    }
    return 'can_apply';
  };

  const formatUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <ProtectedRoute redirectMessage="Please log in to view research opportunities">
      <Layout>
        {/* Hero Section */}
        <section className="pt-0 pb-40 hero-glass-bg relative overflow-hidden">
          {/* Enhanced Glass Background for Opportunities Page */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Energetic Glass Elements */}
            <div className="glass-orb glass-panel-orange w-80 h-80 top-1/6 left-1/8 float-slow" />
            <div className="glass-orb glass-panel-emerald w-72 h-72 top-1/3 right-1/6 float-medium" style={{animationDelay: '3s'}} />
            <div className="glass-orb glass-panel-royal w-64 h-64 bottom-1/4 left-1/4 float-fast" style={{animationDelay: '5s'}} />
            
            {/* Dynamic Glass Wave Forms */}
            <div className="glass-wave glass-panel-magenta w-96 h-20 top-1/4 left-1/2 parallax-slow" />
            <div className="glass-wave glass-panel-emerald w-80 h-16 bottom-1/3 right-1/4 parallax-medium" style={{animationDelay: '2s'}} />
            
            {/* Geometric Glass Panels */}
            <div className="glass-geometric glass-panel-orange w-56 h-40 top-1/6 right-1/4 rotate-slow" style={{'--rotation': '12deg'} as React.CSSProperties} />
            <div className="glass-geometric glass-panel-coral w-48 h-32 bottom-1/3 left-1/6 rotate-medium" style={{'--rotation': '-8deg'} as React.CSSProperties} />
            <div className="glass-geometric glass-panel-purple w-40 h-28 top-2/3 right-1/8 rotate-slow" style={{'--rotation': '15deg'} as React.CSSProperties} />
            
            {/* Additional Floating Elements */}
            <div className="glass-orb glass-panel-magenta w-32 h-32 top-1/2 left-1/2 breathe" style={{animationDelay: '1s'}} />
            <div className="glass-orb glass-panel-golden w-28 h-28 bottom-1/6 right-1/3 breathe" style={{animationDelay: '4s'}} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <div className="text-center max-w-4xl mx-auto pt-32">
              <h1 className="text-6xl sm:text-7xl font-bold mb-12 hero-text-shadow">
                <span className="text-foreground">Discover</span>{' '}
                <span className="bg-gradient-hero bg-clip-text text-transparent hero-glow">Opportunities</span>
              </h1>
              <p className="text-2xl sm:text-3xl text-muted-foreground leading-relaxed mb-16 hero-text-shadow">
                Find verified internships, competitions, programs, and events from trusted sources (≈60% curated)
                and exclusive direct postings from organizations (≈40%).
              </p>
              
              {/* Daily Application Counter for Students */}
              {authUser?.user_metadata?.role === 'student' && (
                <div className="mb-8">
                  <EnhancedCard variant="glass" className="backdrop-blur-xl bg-white/20 border-white/30 inline-block">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Daily Applications</p>
                      <p className="text-2xl font-bold">
                        <span className={dailyApplicationCount >= 5 ? 'text-red-500' : 'text-green-500'}>
                          {dailyApplicationCount}
                        </span>
                        <span className="text-muted-foreground">/5</span>
                      </p>
                      {dailyApplicationCount >= 5 && (
                        <p className="text-xs text-red-400 mt-1">Limit reached for today</p>
                      )}
                    </div>
                  </EnhancedCard>
                </div>
              )}
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <EnhancedCard variant="glass" className="backdrop-blur-xl bg-white/20 border-white/30">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search opportunities by title, tags, or organization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground/70"
                      />
                    </div>
                    <EnhancedButton variant="outline-hero" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </EnhancedButton>
                  </div>
                </EnhancedCard>
              </div>
            </div>
          </div>
        </section>

        {/* Organization Post Opportunity Section */}
        {authUser?.user_metadata?.role === 'professor' && (
          <section className="pt-20 pb-12 bg-gradient-subtle">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <EnhancedCard variant="glass" className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Post a New Opportunity (Organizations)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Input
                    placeholder="Opportunity Title"
                    value={newOpp.title}
                    onChange={(e) => setNewOpp({...newOpp, title: e.target.value})}
                  />
                  <Input
                    placeholder="Location"
                    value={newOpp.location}
                    onChange={(e) => setNewOpp({...newOpp, location: e.target.value})}
                  />
                  <Input
                    placeholder="Duration (e.g., 3 months, 1 year)"
                    value={newOpp.duration}
                    onChange={(e) => setNewOpp({...newOpp, duration: e.target.value})}
                  />
                  <Input
                    placeholder="Compensation (e.g., $15/hour, $5000 stipend)"
                    value={newOpp.compensation}
                    onChange={(e) => setNewOpp({...newOpp, compensation: e.target.value})}
                  />
                  <Select value={newOpp.type} onValueChange={(value) => setNewOpp({...newOpp, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    placeholder="Application Deadline"
                    value={newOpp.application_deadline}
                    onChange={(e) => setNewOpp({...newOpp, application_deadline: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Applicant Cap (0 for no cap)"
                    value={newOpp.applicant_cap}
                    onChange={(e) => setNewOpp({...newOpp, applicant_cap: e.target.value})}
                  />
                  <Input
                    placeholder="Optional: Link to external application or details"
                    value={newOpp.opportunity_link}
                    onChange={(e) => setNewOpp({...newOpp, opportunity_link: e.target.value})}
                  />
                </div>
                <div className="mb-6">
                  <Input
                    placeholder="Tags (comma-separated: AI, Machine Learning, Python)"
                    value={newOpp.tags}
                    onChange={(e) => setNewOpp({...newOpp, tags: e.target.value})}
                  />
                </div>
                <div className="mb-6">
                  <textarea
                    placeholder="Detailed description of the opportunity, requirements, and what students will learn..."
                    value={newOpp.description}
                    onChange={(e) => setNewOpp({...newOpp, description: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none h-32"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Input
                    placeholder="External Details Link (optional)"
                    value={newOpp.opportunity_link}
                    onChange={(e) => setNewOpp({...newOpp, opportunity_link: e.target.value})}
                  />
                  <Input
                    placeholder="Application Link (direct URL for Apply Now)"
                    value={newOpp.app_link}
                    onChange={(e) => setNewOpp({...newOpp, app_link: e.target.value})}
                  />
                </div>
                <div className="flex justify-end">
                  <EnhancedButton 
                    variant="hero"
                    onClick={async () => {
                      if (!authUser) return;
                      if (!newOpp.title || !newOpp.description) {
                        setError('Please fill in all required fields');
                        return;
                      }
                      const { error } = await createOpportunity({
                        professor_id: authUser.id,
                        title: newOpp.title,
                        description: newOpp.description,
                        tags: newOpp.tags.split(',').map(t => t.trim()).filter(Boolean),
                        location: newOpp.location,
                        duration: newOpp.duration,
                        compensation: newOpp.compensation,
                        type: newOpp.type,
                        application_deadline: newOpp.application_deadline || undefined,
                        applicants: 0,
                        applicant_cap: newOpp.applicant_cap ? parseInt(newOpp.applicant_cap, 10) : 0,
                        opportunity_link: newOpp.opportunity_link || undefined,
                        app_link: newOpp.app_link || undefined,
                      });
                      if (error) {
                        setError('Failed to create opportunity');
                      } else {
                        setNewOpp({ title: '', description: '', tags: '', location: '', duration: '', compensation: '', type: 'Remote', application_deadline: '', applicant_cap: '', opportunity_link: '', app_link: '' });
                        const { data } = await getAllOpportunities();
                        setOpportunities(data || []);
                      }
                    }}
                  >
                    Post Opportunity
                  </EnhancedButton>
                </div>
              </EnhancedCard>
            </div>
          </section>
        )}

        {/* Opportunities Grid */}
        <section className="pt-64 pb-80 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {loading ? 'Loading Opportunities...' : `${filteredOpportunities.length} Opportunities Found`}
                </h2>
                <p className="text-muted-foreground">
                  Verified listings and exclusive direct postings
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sort by: Latest</span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-8">
              {filteredOpportunities.slice(0, visibleOpportunities).map((opportunity, index) => (
                <EnhancedCard 
                  key={opportunity.id} 
                  variant="glass" 
                  className="p-6 fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Organization Info */}
                    <div className="flex flex-col items-start space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {(opportunity.professors?.first_name?.[0] || opportunity.professors?.institution?.[0] || 'O')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {opportunity.professors?.institution || 'Organization'}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {opportunity.professors?.institution || 'Organization not specified'}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Award className="h-3 w-3 mr-1" />
                            {opportunity.professors?.department || 'Team/Dept'}
                          </div>
                        </div>
                      </div>
                      {opportunity.professors?.bio && (
                        <div className="w-full">
                          <button
                            onClick={() => toggleDescription(opportunity.id)}
                            className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors mt-2"
                          >
                            {expandedDescriptions[opportunity.id] ? (
                              <>
                                Hide Description <ChevronUp className="ml-1 h-4 w-4" />
                              </>
                            ) : (
                              <>
                                Show Description <ChevronDown className="ml-1 h-4 w-4" />
                              </>
                            )}
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              expandedDescriptions[opportunity.id] ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <p className="text-sm text-muted-foreground">
                              {opportunity.professors.bio}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Opportunity Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-foreground mb-2 hover:text-primary transition-colors">
                            <Link to={`/opportunities/${opportunity.id}`}>
                              {opportunity.title}
                            </Link>
                          </h2>
                          <p className="text-muted-foreground line-clamp-2 mb-3">
                            {opportunity.description}
                          </p>
                        </div>
                        <Badge 
                          variant={opportunity.status === 'Open' ? 'default' : 'secondary'}
                          className="ml-4"
                        >
                          {opportunity.status}
                        </Badge>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(opportunity.tags || []).slice(0, 4).map((tag: string, tagIndex: number) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {(opportunity.tags || []).length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{(opportunity.tags || []).length - 4} more
                          </Badge>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{opportunity.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{opportunity.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>{opportunity.compensation}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{opportunity.applicants ?? 0} applicants</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Deadline: {opportunity.application_deadline ? new Date(opportunity.application_deadline).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        
                        <div className="flex space-x-3">
                          {(() => {
                            if (authUser?.user_metadata?.role === 'professor') {
                              if (opportunity.professor_id === authUser.id) {
                                // Professor's own opportunity, always show link to review applications
                                return (
                                  <EnhancedButton variant="outline-hero" size="sm">
                                    <Link to={`/professor/review-applications/${opportunity.id}`}>
                                      View Applications
                                    </Link>
                                  </EnhancedButton>
                                );
                              } else {
                                // Another professor's opportunity, show link only if it exists
                                return opportunity.opportunity_link && (
                                  <EnhancedButton variant="outline-hero" size="sm">
                                    <a href={formatUrl(opportunity.opportunity_link)} target="_blank" rel="noopener noreferrer">
                                      View Details
                                    </a>
                                  </EnhancedButton>
                                );
                              }
                            } else if (authUser?.user_metadata?.role === 'student') {
                              // Student view, show link only if it exists
                              return opportunity.opportunity_link && (
                                <EnhancedButton variant="outline-hero" size="sm">
                                  <a href={formatUrl(opportunity.opportunity_link)} target="_blank" rel="noopener noreferrer">
                                    View Details
                                  </a>
                                </EnhancedButton>
                              );
                            }
                            return null;
                          })()}
                          
                          {authUser?.user_metadata?.role === 'student' && (
                            <>
                              {/* Portfolio Download Link for Applied Students */}
                              {applications.some(app => app.opportunity_id === opportunity.id) && (
                                <div className="flex items-center">
                                  <a 
                                    href={applications.find(app => app.opportunity_id === opportunity.id)?.portfolio_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors mr-3"
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Portfolio
                                  </a>
                                </div>
                              )}
                              
                              {opportunity.app_link ? (
                                <EnhancedButton variant="hero" size="sm">
                                  <a href={formatUrl(opportunity.app_link)} target="_blank" rel="noopener noreferrer">
                                    Apply Now
                                  </a>
                                </EnhancedButton>
                              ) : (
                                <EnhancedButton 
                                  variant={
                                    getApplicationStatus(opportunity) === 'applied' ? 'outline-hero' :
                                    getApplicationStatus(opportunity) === 'cap_reached' ? 'glass' :
                                    'hero'
                                  }
                                  size="sm" 
                                  disabled={getApplicationStatus(opportunity) !== 'can_apply'}
                                  onClick={() => {
                                    setError('');
                                    const professorId = opportunity.professor_id || opportunity.professors?.id;
                                    if (!authUser || !professorId) return;
                                    handleApply(opportunity.id, professorId);
                                  }}
                                >
                                  {getApplicationStatus(opportunity) === 'applied' ? 'Applied' : 
                                   getApplicationStatus(opportunity) === 'cap_reached' ? 'Applicant Cap Reached' :
                                   getApplicationStatus(opportunity) === 'daily_limit_reached' ? 'Daily Limit Reached' :
                                   'Apply Now'}
                                </EnhancedButton>
                              )}

                                                             {getApplicationStatus(opportunity) === 'daily_limit_reached' && (
                                 <Alert variant="destructive" className="mt-2">
                                   <AlertTriangle className="h-4 w-4 mr-2" />
                                   <AlertDescription>
                                     You have reached your daily application limit of 5 opportunities.
                                     Please try again tomorrow.
                                   </AlertDescription>
                                 </Alert>
                               )}

                               {opportunity.applicant_cap > 0 && opportunity.applicants >= opportunity.applicant_cap && (
                                 <Alert variant="default" className="mt-2">
                                   <AlertTriangle className="h-4 w-4 mr-2" />
                                   <AlertDescription>
                                     This opportunity has reached its applicant cap of {opportunity.applicant_cap}.
                                     No more applications will be accepted.
                                   </AlertDescription>
                                 </Alert>
                               )}

                               {opportunity.cap_reached_at && isCapReached(opportunity) && (
                                 <Alert variant="default" className="mt-2">
                                   <AlertTriangle className="h-4 w-4 mr-2" />
                                   <AlertDescription>
                                     This opportunity's applicant cap was reached on {opportunity.cap_reached_date}.
                                     No more applications will be accepted.
                                   </AlertDescription>
                                 </Alert>
                               )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </EnhancedCard>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              {visibleOpportunities < filteredOpportunities.length ? (
                <EnhancedButton 
                  variant="outline-hero" 
                  size="lg"
                  onClick={() => setVisibleOpportunities(prev => Math.min(prev + 5, filteredOpportunities.length))}
                >
                  Load More Opportunities ({filteredOpportunities.length - visibleOpportunities} remaining)
                </EnhancedButton>
              ) : filteredOpportunities.length > 0 ? (
                <div className="text-muted-foreground">
                  <p>All opportunities have been loaded</p>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  <p>No opportunities found</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </Layout>
    </ProtectedRoute>
  );
};

export default Opportunities;