import { useRef, useState } from 'react';
import { Layout } from '@/components/Layout';
import { EnhancedCard } from '@/components/EnhancedCard';
import { EnhancedButton } from '@/components/EnhancedButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Building2, 
  ClipboardList, 
  Upload,
  X,
  Plus,
  ArrowRight,
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createProfessorProfile, uploadFile } from '@/lib/database';

const OrganizationRegistration = () => {
  const [step, setStep] = useState(1);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [newFocusArea, setNewFocusArea] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    orgName: '',
    orgType: '' as 'Company' | 'Nonprofit' | 'Startup' | 'School' | '',
    orgSize: '' as '1-10' | '11-50' | '51-200' | '201-500' | '500+' | '',
    website: '',
    contactFirstName: '',
    contactLastName: '',
    contactRole: '',
    email: '',
    password: '',
    confirmPassword: '',
    locations: '',
    remotePolicy: '' as 'Remote' | 'Hybrid' | 'On-site' | '',
    postingIntent: '' as 'Internships' | 'Competitions' | 'Workshops' | 'Volunteering' | 'Events' | 'Multiple' | '',
    description: '',
    verificationDoc: null as File | null
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleAddFocusArea = () => {
    if (newFocusArea.trim() && !focusAreas.includes(newFocusArea.trim())) {
      setFocusAreas([...focusAreas, newFocusArea.trim()]);
      setNewFocusArea('');
    }
  };

  const handleRemoveFocusArea = (areaToRemove: string) => {
    setFocusAreas(focusAreas.filter(area => area !== areaToRemove));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // NOTE: Keep underlying role as 'professor' to avoid DB changes, even though UI is Organization
      const { data: authData, error: authError } = await signUp(
        formData.email,
        formData.password,
        'professor',
        `${formData.orgName} (${formData.contactFirstName} ${formData.contactLastName})`
      );

      if (authError) {
        setError(authError.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      if (!authData?.session && authData?.user?.id) {
        let verificationDocUrl = '';
        let verificationDocFilename = '';

        if (formData.verificationDoc) {
          const uploadResult = await uploadFile(formData.verificationDoc, authData.user.id, 'verification');
          if (uploadResult) {
            verificationDocUrl = uploadResult.url;
            verificationDocFilename = uploadResult.filename;
          }
        }

        const { error: profileError } = await createProfessorProfile({
          // Mapping organization fields into existing columns
          title: formData.orgType, // repurpose for org type
          first_name: formData.contactFirstName,
          last_name: formData.contactLastName,
          email: formData.email,
          institution: formData.orgName, // organization name
          department: formData.orgSize, // org size
          position: formData.contactRole,
          bio: `${formData.description}\n\nFocus Areas: ${focusAreas.join(', ')}`,
          website: formData.website,
          orcid: formData.remotePolicy, // repurpose for remote policy
          publications: formData.postingIntent, // repurpose for posting intent
          research_areas: focusAreas,
          verification_doc_url: verificationDocUrl || undefined,
          verification_doc_filename: verificationDocFilename || undefined,
          email_confirmed: false,
          created_at: new Date().toISOString()
        }, authData.user.id);

        if (profileError) {
          setError('Account created but there was an error saving your profile. Please contact support.');
        } else {
          navigate('/login?message=Registration successful! Please check your email to verify your account before logging in.');
        }
        return;
      }

      if (authData?.user) {
        let verificationDocUrl = '';
        let verificationDocFilename = '';

        if (formData.verificationDoc) {
          const uploadResult = await uploadFile(formData.verificationDoc, authData.user.id, 'verification');
          if (uploadResult) {
            verificationDocUrl = uploadResult.url;
            verificationDocFilename = uploadResult.filename;
          }
        }

        const { error: profileError } = await createProfessorProfile({
          title: formData.orgType,
          first_name: formData.contactFirstName,
          last_name: formData.contactLastName,
          email: formData.email,
          institution: formData.orgName,
          department: formData.orgSize,
          position: formData.contactRole,
          bio: `${formData.description}\n\nFocus Areas: ${focusAreas.join(', ')}`,
          website: formData.website,
          orcid: formData.remotePolicy,
          publications: formData.postingIntent,
          research_areas: focusAreas,
          verification_doc_url: verificationDocUrl || undefined,
          verification_doc_filename: verificationDocFilename || undefined
        }, authData.user.id);

        if (profileError) {
          setError('Account created but there was an error saving your profile. Please contact support.');
        } else {
          if (authData?.user && !authData.user.email_confirmed_at) {
            navigate('/login?message=Registration successful! Please check your email to verify your account before logging in.');
          } else {
            navigate('/login?message=Registration successful! You can now log in.');
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!formData.orgName || !formData.orgType || !formData.contactFirstName || !formData.contactLastName) {
        setError('Please complete your organization and contact details.');
        return;
      }
    } else if (step === 2) {
      if (!formData.orgSize || !formData.remotePolicy) {
        setError('Please specify your organization size and remote policy.');
        return;
      }
    } else if (step === 3) {
      if (focusAreas.length === 0) {
        setError('Please add at least one focus area.');
        return;
      }
    }
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return Boolean(formData.orgName && formData.orgType && formData.contactFirstName && formData.contactLastName && formData.email && formData.password && formData.confirmPassword && formData.password.length >= 6 && formData.password === formData.confirmPassword);
      case 2:
        return Boolean(formData.orgSize && formData.remotePolicy !== '');
      case 3:
        return focusAreas.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-section py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-foreground">Join as an</span>{' '}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Organization</span>
            </h1>
            <p className="text-muted-foreground">
              Post student‑friendly opportunities and connect with early‑career talent
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <EnhancedCard variant="glass" className="p-8">
            {error && (
              <div className="mb-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Step 1: Organization & Contact */}
            {step === 1 && (
              <div className="space-y-6 fade-in-up">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Organization & Contact</h2>
                  <p className="text-muted-foreground">Tell students who you are</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input id="orgName" placeholder="e.g., Acme Corp" className="input-enhanced" value={formData.orgName} onChange={(e) => setFormData(prev => ({...prev, orgName: e.target.value}))} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgType">Organization Type</Label>
                      <select className="input-enhanced w-full" value={formData.orgType} onChange={(e) => setFormData(prev => ({...prev, orgType: e.target.value as 'Company' | 'Nonprofit' | 'Startup' | 'School' | ''}))}>
                        <option value="">Select type</option>
                        <option value="Company">Company</option>
                        <option value="Startup">Startup</option>
                        <option value="Nonprofit">Nonprofit</option>
                        <option value="School">School</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" placeholder="https://example.com" className="input-enhanced" value={formData.website} onChange={(e) => setFormData(prev => ({...prev, website: e.target.value}))} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactFirstName">Contact First Name</Label>
                      <Input id="contactFirstName" placeholder="First name" className="input-enhanced" value={formData.contactFirstName} onChange={(e) => setFormData(prev => ({...prev, contactFirstName: e.target.value}))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactLastName">Contact Last Name</Label>
                      <Input id="contactLastName" placeholder="Last name" className="input-enhanced" value={formData.contactLastName} onChange={(e) => setFormData(prev => ({...prev, contactLastName: e.target.value}))} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactRole">Contact Role/Title</Label>
                    <Input id="contactRole" placeholder="e.g., Program Manager" className="input-enhanced" value={formData.contactRole} onChange={(e) => setFormData(prev => ({...prev, contactRole: e.target.value}))} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input id="email" type="email" placeholder="you@organization.com" className="input-enhanced pl-10" value={formData.email} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" className="input-enhanced pl-10 pr-10" value={formData.password} onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" className="input-enhanced pl-10 pr-10" value={formData.confirmPassword} onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Organization Details */}
            {step === 2 && (
              <div className="space-y-6 fade-in-up">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Organization Details</h2>
                  <p className="text-muted-foreground">Help students understand your opportunities</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgSize">Organization Size</Label>
                    <select className="input-enhanced w-full" value={formData.orgSize} onChange={(e) => setFormData(prev => ({...prev, orgSize: e.target.value as '1-10' | '11-50' | '51-200' | '201-500' | '500+' | ''}))}>
                      <option value="">Select size</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remotePolicy">Remote Policy</Label>
                    <select className="input-enhanced w-full" value={formData.remotePolicy} onChange={(e) => setFormData(prev => ({...prev, remotePolicy: e.target.value as 'Remote' | 'Hybrid' | 'On-site' | ''}))}>
                      <option value="">Select policy</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locations">Primary Locations (comma-separated)</Label>
                  <Input id="locations" placeholder="e.g., Remote, New York, London" className="input-enhanced" value={formData.locations} onChange={(e) => setFormData(prev => ({...prev, locations: e.target.value}))} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postingIntent">Opportunity Types You Plan to Post</Label>
                  <select className="input-enhanced w-full" value={formData.postingIntent} onChange={(e) => setFormData(prev => ({...prev, postingIntent: e.target.value as 'Internships' | 'Competitions' | 'Workshops' | 'Volunteering' | 'Events' | 'Multiple' | ''}))}>
                    <option value="">Select an option</option>
                    <option value="Internships">Internships</option>
                    <option value="Competitions">Competitions</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Volunteering">Volunteering</option>
                    <option value="Events">Events</option>
                    <option value="Multiple">Multiple</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">About Your Opportunities</Label>
                  <Textarea id="description" placeholder="Share what makes your opportunities student-friendly and accessible..." className="input-enhanced min-h-40" value={formData.description} onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))} />
                </div>
              </div>
            )}

            {/* Step 3: Focus Areas */}
            {step === 3 && (
              <div className="space-y-6 fade-in-up">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Focus Areas</h2>
                  <p className="text-muted-foreground">What skills or domains are you looking for?</p>
                </div>

                <div className="space-y-3">
                  <Label>Focus Areas</Label>
                  <div className="flex space-x-2">
                    <Input placeholder="Add a focus area (e.g., Frontend, Data Science)" className="input-enhanced" value={newFocusArea} onChange={(e) => setNewFocusArea(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddFocusArea()} />
                    <EnhancedButton variant="outline-hero" size="sm" onClick={handleAddFocusArea} className="px-4">
                      <Plus className="w-4 h-4" />
                    </EnhancedButton>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {focusAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {area}
                        <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => handleRemoveFocusArea(area)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Verification (Optional) */}
            {step === 4 && (
              <div className="space-y-6 fade-in-up">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Account Verification</h2>
                  <p className="text-muted-foreground">Optional document to help us verify your organization</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Upload Verification Document (Optional)</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (!file) return;
                        if (file.size > 10 * 1024 * 1024) {
                          setError('File too large. Max size is 10MB.');
                          return;
                        }
                        if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
                          setError('Invalid file type. Please upload a PDF.');
                          return;
                        }
                        setError('');
                        setFormData((prev) => ({ ...prev, verificationDoc: file }));
                      }}
                    />
                    <div
                      className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files && e.dataTransfer.files[0];
                        if (!file) return;
                        if (file.size > 10 * 1024 * 1024) {
                          setError('File too large. Max size is 10MB.');
                          return;
                        }
                        if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
                          setError('Invalid file type. Please upload a PDF.');
                          return;
                        }
                        setError('');
                        setFormData((prev) => ({ ...prev, verificationDoc: file }));
                      }}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-primary">Click to upload</span> or drag and drop
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Proof of organization status or letterhead (PDF up to 10MB)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border/20">
              <div>
                {step > 1 && (
                  <EnhancedButton variant="outline-hero" onClick={handlePrev}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </EnhancedButton>
                )}
              </div>

              <div className="flex space-x-4">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Already have an account? Sign in
                </Link>
                {step < totalSteps ? (
                  <EnhancedButton variant="hero" onClick={handleNext} disabled={!canProceed()}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </EnhancedButton>
                ) : (
                  <EnhancedButton variant="hero" onClick={handleSubmit} disabled={!canProceed() || loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </EnhancedButton>
                )}
              </div>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </Layout>
  );
};

export default OrganizationRegistration;
