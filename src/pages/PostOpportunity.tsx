import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { EnhancedCard } from '@/components/EnhancedCard';
import { EnhancedButton } from '@/components/EnhancedButton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Rocket } from 'lucide-react';
import { createOpportunity } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const PostOpportunity = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async () => {
    if (!authUser) return;
    
    if (!newOpp.title || !newOpp.description) {
      setError('Please fill in all required fields (Title and Description)');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
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
        setError('Failed to create opportunity. Please try again.');
        setIsSubmitting(false);
      } else {
        // Show success toast with custom styling
        toast.success('🎉 Opportunity Posted Successfully!', {
          description: 'Your opportunity is now live and visible to students.',
          duration: 5000,
          className: 'bg-gradient-hero text-white border-0',
          style: {
            background: 'linear-gradient(135deg, #FFA800 0%, #FF6B35 50%, #9B59B6 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
          },
        });

        // Redirect to home after a short delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute redirectMessage="Please log in to post opportunities">
      <Layout>
        {/* Hero Section */}
        <section className="pt-0 pb-40 hero-glass-bg relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="glass-orb glass-panel-orange w-80 h-80 top-1/6 left-1/8 float-slow" />
            <div className="glass-orb glass-panel-emerald w-72 h-72 top-1/3 right-1/6 float-medium" style={{animationDelay: '3s'}} />
            <div className="glass-orb glass-panel-royal w-64 h-64 bottom-1/4 left-1/4 float-fast" style={{animationDelay: '5s'}} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <div className="text-center max-w-4xl mx-auto pt-32">
              <div className="flex items-center justify-center mb-6">
                <Rocket className="w-12 h-12 text-primary mr-4 animate-bounce" />
                <h1 className="text-6xl sm:text-7xl font-bold hero-text-shadow">
                  <span className="text-foreground">Post Your</span>{' '}
                  <span className="bg-gradient-hero bg-clip-text text-transparent hero-glow">Opportunity</span>
                </h1>
                <Sparkles className="w-12 h-12 text-primary ml-4 animate-pulse" />
              </div>
              <p className="text-2xl sm:text-3xl text-muted-foreground leading-relaxed hero-text-shadow">
                Share amazing opportunities with talented students
              </p>
            </div>
          </div>
        </section>

        {/* Post Opportunity Form */}
        <section className="pt-20 pb-80 bg-gradient-subtle">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <EnhancedCard variant="glass" className="p-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Create New Opportunity</h2>
              <p className="text-muted-foreground mb-8">Fill in the details below to post your opportunity</p>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Opportunity Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Summer Research Internship in AI"
                    value={newOpp.title}
                    onChange={(e) => setNewOpp({...newOpp, title: e.target.value})}
                    className="text-base"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Detailed description of the opportunity, requirements, and what students will learn..."
                    value={newOpp.description}
                    onChange={(e) => setNewOpp({...newOpp, description: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none h-40 text-base"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tags
                  </label>
                  <Input
                    placeholder="AI, Machine Learning, Python, Research (comma-separated)"
                    value={newOpp.tags}
                    onChange={(e) => setNewOpp({...newOpp, tags: e.target.value})}
                    className="text-base"
                  />
                </div>

                {/* Two Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location
                    </label>
                    <Input
                      placeholder="e.g., Remote, New York, NY"
                      value={newOpp.location}
                      onChange={(e) => setNewOpp({...newOpp, location: e.target.value})}
                      className="text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Duration
                    </label>
                    <Input
                      placeholder="e.g., 3 months, 1 year"
                      value={newOpp.duration}
                      onChange={(e) => setNewOpp({...newOpp, duration: e.target.value})}
                      className="text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Compensation
                    </label>
                    <Input
                      placeholder="e.g., $15/hour, $5000 stipend"
                      value={newOpp.compensation}
                      onChange={(e) => setNewOpp({...newOpp, compensation: e.target.value})}
                      className="text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Type
                    </label>
                    <Select value={newOpp.type} onValueChange={(value: 'Remote' | 'On-site' | 'Hybrid') => setNewOpp({...newOpp, type: value})}>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="On-site">On-site</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Application Deadline
                    </label>
                    <Input
                      type="date"
                      value={newOpp.application_deadline}
                      onChange={(e) => setNewOpp({...newOpp, application_deadline: e.target.value})}
                      className="text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Applicant Cap
                    </label>
                    <Input
                      type="number"
                      placeholder="0 for no cap"
                      value={newOpp.applicant_cap}
                      onChange={(e) => setNewOpp({...newOpp, applicant_cap: e.target.value})}
                      className="text-base"
                    />
                  </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Details Link (Optional)
                    </label>
                    <Input
                      placeholder="https://example.com/details"
                      value={newOpp.opportunity_link}
                      onChange={(e) => setNewOpp({...newOpp, opportunity_link: e.target.value})}
                      className="text-base"
                    />
                    <p className="text-xs text-muted-foreground mt-1">External link for more information</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Application Link (Optional)
                    </label>
                    <Input
                      placeholder="https://example.com/apply"
                      value={newOpp.app_link}
                      onChange={(e) => setNewOpp({...newOpp, app_link: e.target.value})}
                      className="text-base"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Direct URL for external applications</p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                  <EnhancedButton 
                    variant="outline-hero"
                    onClick={() => navigate('/opportunities')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </EnhancedButton>
                  <EnhancedButton 
                    variant="hero"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Posting...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Rocket className="w-4 h-4 mr-2" />
                        Post Opportunity
                      </span>
                    )}
                  </EnhancedButton>
                </div>
              </div>
            </EnhancedCard>
          </div>
        </section>
      </Layout>
    </ProtectedRoute>
  );
};

export default PostOpportunity;
