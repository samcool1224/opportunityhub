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
  Building, 
  BookOpen, 
  Award,
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

const ProfessorRegistration = () => {
  const [step, setStep] = useState(1);
  const [researchAreas, setResearchAreas] = useState<string[]>([]);
  const [newResearchArea, setNewResearchArea] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
    department: '',
    position: '',
    bio: '',
    website: '',
    orcid: '',
    publications: '',
    verificationDoc: null as File | null
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleAddResearchArea = () => {
    if (newResearchArea.trim() && !researchAreas.includes(newResearchArea.trim())) {
      setResearchAreas([...researchAreas, newResearchArea.trim()]);
      setNewResearchArea('');
    }
  };

  const handleRemoveResearchArea = (areaToRemove: string) => {
    setResearchAreas(researchAreas.filter(area => area !== areaToRemove));
  };

  const handleSubmit = async () => {
    console.log('Professor handleSubmit called');
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    console.log('Professor validation passed, attempting signup...');

    try {
      // First create the auth user
      const { data: authData, error: authError } = await signUp(
        formData.email,
        formData.password,
        'professor',
        `${formData.title} ${formData.firstName} ${formData.lastName}`
      );

      if (authError) {
        console.error('Auth error:', authError);
        setError(authError.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      // If email confirmation is required, create the profile immediately but mark as unconfirmed
      if (!authData?.session && authData?.user?.id) {
        let verificationDocUrl = '';
        let verificationDocFilename = '';

        // Upload verification document if provided
        if (formData.verificationDoc) {
          const uploadResult = await uploadFile(formData.verificationDoc, authData.user.id, 'verification');
          if (uploadResult) {
            verificationDocUrl = uploadResult.url;
            verificationDocFilename = uploadResult.filename;
          }
        }

        // Create professor profile immediately with unconfirmed status
        const { error: profileError } = await createProfessorProfile({
          title: formData.title,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          institution: formData.institution,
          department: formData.department,
          position: formData.position,
          bio: formData.bio,
          website: formData.website,
          orcid: formData.orcid,
          publications: formData.publications,
          research_areas: researchAreas,
          verification_doc_url: verificationDocUrl || undefined,
          verification_doc_filename: verificationDocFilename || undefined,
          email_confirmed: false,
          created_at: new Date().toISOString()
        }, authData.user.id);

        if (profileError) {
          console.error('Error creating professor profile:', profileError);
          setError('Account created but there was an error saving your profile. Please contact support.');
        } else {
          navigate('/login?message=Registration successful! Please check your email to verify your account before logging in. We will manually approve all professor accounts within 3 business days.');
        }
        return;
      }

      // If auth user was created successfully, create the professor profile
      if (authData?.user) {
        let verificationDocUrl = '';
        let verificationDocFilename = '';

        // Upload verification document if provided
        if (formData.verificationDoc) {
          const uploadResult = await uploadFile(formData.verificationDoc, authData.user.id, 'verification');
          if (uploadResult) {
            verificationDocUrl = uploadResult.url;
            verificationDocFilename = uploadResult.filename;
          }
        }

        // Create professor profile with all the form data
        const { error: profileError } = await createProfessorProfile({
          title: formData.title,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          institution: formData.institution,
          department: formData.department,
          position: formData.position,
          bio: formData.bio,
          website: formData.website,
          orcid: formData.orcid,
          publications: formData.publications,
          research_areas: researchAreas,
          verification_doc_url: verificationDocUrl || undefined,
          verification_doc_filename: verificationDocFilename || undefined
        }, authData.user.id);

        if (profileError) {
          console.error('Error creating professor profile:', profileError);
          setError('Account created but there was an error saving your profile. Please contact support.');
        } else {
          // Check if email confirmation is required
          if (authData?.user && !authData.user.email_confirmed_at) {
            navigate('/login?message=Registration successful! Please check your email to verify your account before logging in. We will manually approve all professor accounts within 3 business days.');
          } else {
            navigate('/login?message=Registration successful! You can now log in. Note: Professor accounts require manual approval which may take up to 3 business days.');
          }
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
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
    } else if (step === 2) {
      if (!formData.institution || !formData.department || !formData.position) {
        setError('Please complete your institutional affiliation (institution, department, and position).');
        return;
      }
    } else if (step === 3) {
      if (researchAreas.length === 0) {
        setError('Please add at least one research area.');
        return;
      }
    }
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    const result = (() => {
      switch (step) {
        case 1:
          {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const fieldsFilled = formData.firstName && formData.lastName && formData.email && formData.title && formData.password && formData.confirmPassword;
            const emailValid = emailRegex.test(formData.email);
            const passwordValid = formData.password.length >= 6;
            const passwordsMatch = formData.password === formData.confirmPassword;
            return Boolean(fieldsFilled && emailValid && passwordValid && passwordsMatch);
          }
        case 2:
          return formData.institution && formData.department && formData.position;
        case 3:
          return researchAreas.length > 0; // Bio is optional
        case 4:
          return true; // Optional verification step
        default:
          return false;
      }
    })();
    
    console.log(`Professor Step ${step}, canProceed: ${result}`, {
      step,
      formData: step === 1 ? {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        title: formData.title,
        hasPassword: !!formData.password,
        hasConfirmPassword: !!formData.confirmPassword
      } : step === 2 ? {
        institution: formData.institution,
        department: formData.department,
        position: formData.position
      } : step === 3 ? {
        researchAreasCount: researchAreas.length,
        bioLength: formData.bio.length
      } : {}
    });
    
    return result;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-section py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-foreground">Join as a</span>{' '}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Professor</span>
            </h1>
            <p className="text-muted-foreground">
              Connect with exceptional student researchers
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <EnhancedCard variant="glass" className="p-8">
            {/* Error banner (any step) */}
            {error && (
              <div className="mb-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6 fade-in-up">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
                  <p className="text-muted-foreground">Let's start with your details</p>
                </div>

                {/* Error moved above to show on any step */}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <select 
                      className="input-enhanced w-full"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                    >
                      <option value="">Select title</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                      <option value="Professor">Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Adjunct Professor">Adjunct Professor</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        className="input-enhanced"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        className="input-enhanced"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Institutional Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="professor@university.edu"
                        className="input-enhanced pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        className="input-enhanced pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="input-enhanced pl-10 pr-10"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Institutional Affiliation */}
            {step === 2 && (
              <div className="space-y-6 fade-in-up">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Institutional Affiliation</h2>
                  <p className="text-muted-foreground">Tell us about your academic position</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      placeholder="e.g., Massachusetts Institute of Technology"
                      className="input-enhanced"
                      value={formData.institution}
                      onChange={(e) => setFormData(prev => ({...prev, institution: e.target.value}))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department/School</Label>
                    <Input
                      id="department"
                      placeholder="e.g., Computer Science & Artificial Intelligence Laboratory"
                      className="input-enhanced"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({...prev, department: e.target.value}))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position/Role</Label>
                    <Input
                      id="position"
                      placeholder="e.g., Associate Professor, Principal Investigator"
                      className="input-enhanced"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({...prev, position: e.target.value}))}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Lab/Personal Website (Optional)</Label>
                      <Input
                        id="website"
                        placeholder="https://yourlab.university.edu"
                        className="input-enhanced"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({...prev, website: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orcid">ORCID ID (Optional)</Label>
                      <Input
                        id="orcid"
                        placeholder="0000-0000-0000-0000"
                        className="input-enhanced"
                        value={formData.orcid}
                        onChange={(e) => setFormData(prev => ({...prev, orcid: e.target.value}))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Research Profile */}
            {step === 3 && (
              <div className="space-y-6 fade-in-up">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Research Profile</h2>
                  <p className="text-muted-foreground">Describe your research and expertise</p>
                </div>

                <div className="space-y-6">
                  {/* Research Areas */}
                  <div className="space-y-3">
                    <Label>Research Areas</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a research area (e.g., Machine Learning)"
                        className="input-enhanced"
                        value={newResearchArea}
                        onChange={(e) => setNewResearchArea(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddResearchArea()}
                      />
                      <EnhancedButton 
                        variant="outline-hero" 
                        size="sm" 
                        onClick={handleAddResearchArea}
                        className="px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </EnhancedButton>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {researchAreas.map((area, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {area}
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-destructive" 
                            onClick={() => handleRemoveResearchArea(area)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Research Description & Lab Overview</Label>
                    <Textarea
                      id="bio"
                      placeholder="Describe your research focus, current projects, and what kind of students would thrive in your lab..."
                      className="input-enhanced min-h-40"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
                    />
                    <div className="text-xs text-muted-foreground">
                      {formData.bio.length}/1000 characters
                    </div>
                  </div>

                  {/* Publications */}
                  <div className="space-y-2">
                    <Label htmlFor="publications">Recent Publications (Optional)</Label>
                    <Textarea
                      id="publications"
                      placeholder="List 3-5 recent publications or key research achievements..."
                      className="input-enhanced min-h-24"
                      value={formData.publications}
                      onChange={(e) => setFormData(prev => ({...prev, publications: e.target.value}))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Verification */}
            {step === 4 && (
              <div className="space-y-6 fade-in-up">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Account Verification</h2>
                  <p className="text-muted-foreground">Help us verify your academic credentials</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
                    <div className="flex items-start space-x-4">
                      <Award className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Why Verification?</h3>
                        <p className="text-sm text-muted-foreground">
                          We verify all professor accounts to maintain trust and safety in our academic community. 
                          This ensures students can confidently apply to legitimate research opportunities.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
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
                          Faculty ID, University letter, or CV (PDF up to 10MB)
                        </div>
                      </div>
                      {formData.verificationDoc && (
                        <div className="mt-3 text-sm flex items-center justify-between rounded-md border border-border px-3 py-2">
                          <span className="truncate">{formData.verificationDoc.name}</span>
                          <button
                            type="button"
                            className="text-destructive hover:underline"
                            onClick={() => setFormData((prev) => ({ ...prev, verificationDoc: null }))}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground bg-muted/20 rounded-xl p-4">
                      <p className="mb-2"><strong>Alternative verification methods:</strong></p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Institutional email verification (automatic)</li>
                        <li>University directory listing</li>
                        <li>Published research verification</li>
                      </ul>
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
                  <EnhancedButton 
                    variant="hero" 
                    onClick={handleNext}
                    disabled={!canProceed()}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </EnhancedButton>
                ) : (
                  <EnhancedButton 
                    variant="hero" 
                    onClick={() => {
                      console.log('Professor Create Account button clicked!');
                      handleSubmit();
                    }}
                    disabled={!canProceed() || loading}
                  >
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

export default ProfessorRegistration;