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
  School, 
  BookOpen, 
  Star,
  Upload,
  X,
  Plus,
  ArrowRight,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createStudentProfile, uploadFile } from '@/lib/database';

const StudentRegistration = () => {
  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    highoru: '' as 'high school' | 'university' | '',
    university: '',
    major: '',
    year: '',
    gpa: '',
    gpa_scale: '/4' as '/4' | '/100',
    bio: '',
    portfolio: null as File | null,
    links: {
      linkedin: '',
      personal_website: '',
      google_scholar: '',
      github: '',
      researchgate: '',
      availability: '', 
      location_preference: '', 
      work_authorization: '', 
      remote_preference: '', 
      preferred_roles: '', 
      projects_summary: '', 
      achievements_summary: '' 
    }
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
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

    console.log('Validation passed, attempting signup...');

    try {
      // First create the auth user
      const { data: authData, error: authError } = await signUp(
        formData.email,
        formData.password,
        'student',
        `${formData.firstName} ${formData.lastName}`
      );

      if (authError) {
        console.error('Auth error:', authError);
        setError(authError.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      // If email confirmation is required, create the profile immediately but mark as unconfirmed
      if (!authData?.session && authData?.user?.id) {
        let portfolioUrl = '';
        let portfolioFilename = '';

        // Upload portfolio file if provided
        if (formData.portfolio) {
          const uploadResult = await uploadFile(formData.portfolio, authData.user.id, 'portfolios');
          if (uploadResult) {
            portfolioUrl = uploadResult.url;
            portfolioFilename = uploadResult.filename;
          }
        }

        // Create student profile immediately with unconfirmed status
        const { error: profileError } = await createStudentProfile({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          highoru: formData.highoru as 'high school' | 'university',
          university: formData.university,
          major: formData.major,
          year: formData.year,
          gpa: formData.gpa ? `${formData.gpa}${formData.gpa_scale}` : '',
          bio: formData.bio,
          skills: skills,
          interests: interests,
          portfolio_url: portfolioUrl || undefined,
          portfolio_filename: portfolioFilename || undefined,
          links: formData.links,
          email_confirmed: false,
          created_at: new Date().toISOString()
        }, authData.user.id);

        if (profileError) {
          console.error('Error creating student profile:', profileError);
          setError('Account created but there was an error saving your profile. Please contact support.');
        } else {
          navigate('/login?message=Registration successful! Please check your email to verify your account before logging in.');
        }
        return;
      }

      // If auth user was created successfully, create the student profile
      if (authData?.user) {
        let portfolioUrl = '';
        let portfolioFilename = '';

        // Upload portfolio file if provided
        if (formData.portfolio) {
          const uploadResult = await uploadFile(formData.portfolio, authData.user.id, 'portfolios');
          if (uploadResult) {
            portfolioUrl = uploadResult.url;
            portfolioFilename = uploadResult.filename;
          }
        }

        // Create student profile with all the form data
        const { error: profileError } = await createStudentProfile({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          highoru: formData.highoru as 'high school' | 'university',
          university: formData.university,
          major: formData.major,
          year: formData.year,
          gpa: formData.gpa ? `${formData.gpa}${formData.gpa_scale}` : '',
          bio: formData.bio,
          skills: skills,
          interests: interests,
          portfolio_url: portfolioUrl || undefined,
          portfolio_filename: portfolioFilename || undefined,
          links: formData.links
        }, authData.user.id);

        if (profileError) {
          console.error('Error creating student profile:', profileError);
          setError('Account created but there was an error saving your profile. Please contact support.');
        } else {
          // Check if email confirmation is required
          if (authData?.user && !authData.user.email_confirmed_at) {
            navigate('/login?message=Registration successful! Please check your email to verify your account before logging in.');
          } else {
            navigate('/login?message=Registration successful! You can now log in.');
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
      if (!formData.highoru) {
        setError('Please select your status (High School or University).');
        return;
      }
      if (formData.highoru === 'university') {
        if (!formData.university || !formData.major || !formData.year) {
          setError('Please complete your academic background (university, major, and year).');
          return;
        }
      } else if (formData.highoru === 'high school') {
        if (!formData.university || !formData.year) {
          setError('Please complete your academic background (high school name and year).');
          return;
        }
      }
    } else if (step === 3) {
      if (skills.length === 0 || interests.length === 0) {
        setError('Please add at least one skill and one interest.');
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
            const fieldsFilled = formData.firstName && formData.lastName && formData.email && formData.password && formData.confirmPassword;
            const emailValid = emailRegex.test(formData.email);
            const passwordValid = formData.password.length >= 6;
            const passwordsMatch = formData.password === formData.confirmPassword;
            return Boolean(fieldsFilled && emailValid && passwordValid && passwordsMatch);
          }
        case 2:
          if (!formData.highoru) return false;
          if (formData.highoru === 'university') {
            return formData.university && formData.major && formData.year;
          } else if (formData.highoru === 'high school') {
            return formData.university && formData.year;
          }
          return false;
        case 3:
          return skills.length > 0 && interests.length > 0;
        case 4:
          return true; // Bio is optional, so always allow proceeding from step 4
        default:
          return false;
      }
    })();
    
    console.log(`Step ${step}, canProceed: ${result}`, {
      step,
      formData: step === 1 ? {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        hasPassword: !!formData.password,
        hasConfirmPassword: !!formData.confirmPassword
      } : step === 2 ? {
        highoru: formData.highoru,
        university: formData.university,
        major: formData.major,
        year: formData.year
      } : step === 3 ? {
        skillsCount: skills.length,
        interestsCount: interests.length
      } : step === 4 ? {
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
              <span className="bg-gradient-hero bg-clip-text text-transparent">Student</span>
            </h1>
            <p className="text-muted-foreground">
              Build a company-ready profile showcasing your skills, projects, and availability for internships, competitions, and programs.
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
            {/* Error handled at bottom */}

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6 fade-in-up">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
                  <p className="text-muted-foreground">Let's start with the basics</p>
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
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your student email"
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
            )}

            {/* Step 2: Academic Information */}
            {step === 2 && (
              <div className="space-y-6 fade-in-up">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <School className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Academic & Availability</h2>
                  <p className="text-muted-foreground">Help organizations understand your background and logistics</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="highoru">Are you currently in High School or University?</Label>
                    <select
                      id="highoru"
                      className="input-enhanced w-full"
                      value={formData.highoru}
                      onChange={(e) => setFormData(prev => ({...prev, highoru: e.target.value as 'high school' | 'university' | ''}))}
                    >
                      <option value="">Select your status</option>
                      <option value="high school">High School</option>
                      <option value="university">University</option>
                    </select>
                  </div>

                  {formData.highoru === 'university' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="university">University</Label>
                        <Input
                          id="university"
                          placeholder="e.g., Massachusetts Institute of Technology"
                          className="input-enhanced"
                          value={formData.university}
                          onChange={(e) => setFormData(prev => ({...prev, university: e.target.value}))}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="major">Major/Field of Study</Label>
                          <Input
                            id="major"
                            placeholder="e.g., Computer Science"
                            className="input-enhanced"
                            value={formData.major}
                            onChange={(e) => setFormData(prev => ({...prev, major: e.target.value}))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="year">Year</Label>
                          <select 
                            className="input-enhanced w-full"
                            value={formData.year}
                            onChange={(e) => setFormData(prev => ({...prev, year: e.target.value}))}
                          >
                            <option value="">Select your year</option>
                            <option value="Freshman">Freshman</option>
                            <option value="Sophomore">Sophomore</option>
                            <option value="Junior">Junior</option>
                            <option value="Senior">Senior</option>
                            <option value="Graduate">Graduate</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gpa">GPA (Optional)</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="gpa"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="e.g., 3.7"
                            className="input-enhanced"
                            value={formData.gpa}
                            onChange={(e) => setFormData(prev => ({...prev, gpa: e.target.value}))}
                          />
                          <select
                            className="input-enhanced"
                            value={formData.gpa_scale}
                            onChange={(e) => setFormData(prev => ({...prev, gpa_scale: e.target.value as '/4' | '/100'}))}
                          >
                            <option value="/4">/4</option>
                            <option value="/100">/100</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.highoru === 'high school' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="highSchoolName">High School Name</Label>
                        <Input
                          id="highSchoolName"
                          placeholder="e.g., Harvard University"
                          className="input-enhanced"
                          value={formData.university}
                          onChange={(e) => setFormData(prev => ({...prev, university: e.target.value}))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="highSchoolYear">Grade</Label>
                        <select 
                          className="input-enhanced w-full"
                          value={formData.year}
                          onChange={(e) => setFormData(prev => ({...prev, year: e.target.value}))}
                        >
                          <option value="">Select your grade</option>
                          <option value="Grade 9">Grade 9</option>
                          <option value="Grade 10">Grade 10</option>
                          <option value="Grade 11">Grade 11</option>
                          <option value="Grade 12">Grade 12</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gpa">GPA (Optional)</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="gpa"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="e.g., 3.7"
                            className="input-enhanced"
                            value={formData.gpa}
                            onChange={(e) => setFormData(prev => ({...prev, gpa: e.target.value}))}
                          />
                          <select
                            className="input-enhanced"
                            value={formData.gpa_scale}
                            onChange={(e) => setFormData(prev => ({...prev, gpa_scale: e.target.value as '/4' | '/100'}))}
                          >
                            <option value="/4">/4</option>
                            <option value="/100">/100</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Company-facing logistics */}
                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability (start date or hours/week)</Label>
                      <Input
                        id="availability"
                        placeholder="e.g., Available from June 1; 20 hrs/week"
                        className="input-enhanced"
                        value={formData.links.availability}
                        onChange={(e) => setFormData(prev => ({...prev, links: { ...prev.links, availability: e.target.value }}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locationPref">Location Preference</Label>
                      <Input
                        id="locationPref"
                        placeholder="e.g., Remote; Boston, MA"
                        className="input-enhanced"
                        value={formData.links.location_preference}
                        onChange={(e) => setFormData(prev => ({...prev, links: { ...prev.links, location_preference: e.target.value }}))}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workAuth">Work Authorization/Eligibility</Label>
                      <Input
                        id="workAuth"
                        placeholder="e.g., US work eligible; needs sponsorship"
                        className="input-enhanced"
                        value={formData.links.work_authorization}
                        onChange={(e) => setFormData(prev => ({...prev, links: { ...prev.links, work_authorization: e.target.value }}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="remotePref">Remote Preference</Label>
                      <select
                        id="remotePref"
                        className="input-enhanced w-full"
                        value={formData.links.remote_preference}
                        onChange={(e) => setFormData(prev => ({...prev, links: { ...prev.links, remote_preference: e.target.value }}))}
                      >
                        <option value="">Select preference</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Skills & Interests */}
            {step === 3 && (
              <div className="space-y-6 fade-in-up">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Skills & Interests</h2>
                  <p className="text-muted-foreground">Help us match you with relevant opportunities</p>
                </div>

                <div className="space-y-6">
                  {/* Skills */}
                  <div className="space-y-3">
                    <Label>Technical Skills</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a skill (e.g., Python, Machine Learning)"
                        className="input-enhanced"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      />
                      <EnhancedButton 
                        variant="outline-hero" 
                        size="sm" 
                        onClick={handleAddSkill}
                        className="px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </EnhancedButton>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-destructive" 
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="space-y-3">
                    <Label>Research Interests</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add an interest (e.g., AI Ethics, Cancer Research)"
                        className="input-enhanced"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                      />
                      <EnhancedButton 
                        variant="outline-hero" 
                        size="sm" 
                        onClick={handleAddInterest}
                        className="px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </EnhancedButton>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {interest}
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-destructive" 
                            onClick={() => handleRemoveInterest(interest)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Roles */}
                  <div className="space-y-3">
                    <Label>Preferred Roles</Label>
                    <Input
                      placeholder="e.g., Software Engineering Intern, Data Analyst Intern, Marketing Intern"
                      className="input-enhanced"
                      value={formData.links.preferred_roles}
                      onChange={(e) => setFormData(prev => ({...prev, links: { ...prev.links, preferred_roles: e.target.value }}))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Profile & Portfolio */}
            {step === 4 && (
              <div className="space-y-6 fade-in-up">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Complete Your Profile</h2>
                  <p className="text-muted-foreground">Showcase projects, achievements, and links companies care about</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell organizations about yourself, your interests, and what youre looking for..."
                      className="input-enhanced min-h-32"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
                    />
                    <div className="text-xs text-muted-foreground">
                      {formData.bio.length}/500 characters
                    </div>
                  </div>

                  {/* Projects Summary */}
                  <div className="space-y-2">
                    <Label htmlFor="projects">Projects (highlights)</Label>
                    <Textarea
                      id="projects"
                      placeholder="Briefly describe 2-3 relevant projects with impact (tech, role, results)"
                      className="input-enhanced min-h-28"
                      value={formData.links.projects_summary}
                      onChange={(e) => setFormData(prev => ({...prev, links: { ...prev.links, projects_summary: e.target.value }}))}
                    />
                  </div>

                  {/* Achievements Summary */}
                  <div className="space-y-2">
                    <Label htmlFor="achievements">Achievements</Label>
                    <Textarea
                      id="achievements"
                      placeholder="Awards, competitions, leadership roles, hackathons, publications"
                      className="input-enhanced min-h-24"
                      value={formData.links.achievements_summary}
                      onChange={(e) => setFormData(prev => ({...prev, links: { ...prev.links, achievements_summary: e.target.value }}))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio/Resume (Optional)</Label>
                    <input
                      ref={fileInputRef}
                      id="portfolio"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (!file) return;
                        if (file.size > 10 * 1024 * 1024) {
                          setError('File too large. Max size is 10MB.');
                          return;
                        }
                        const allowed = [
                          'application/pdf',
                          'application/msword',
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        ];
                        if (!allowed.includes(file.type) && !/\.(pdf|doc|docx)$/i.test(file.name)) {
                          setError('Invalid file type. Please upload a PDF or DOC/DOCX file.');
                          return;
                        }
                        setError('');
                        setFormData((prev) => ({ ...prev, portfolio: file }));
                      }}
                    />
                    <div
                      className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files && e.dataTransfer.files[0];
                        if (!file) return;
                        if (file.size > 10 * 1024 * 1024) {
                          setError('File too large. Max size is 10MB.');
                          return;
                        }
                        const allowed = [
                          'application/pdf',
                          'application/msword',
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        ];
                        if (!allowed.includes(file.type) && !/\.(pdf|doc|docx)$/i.test(file.name)) {
                          setError('Invalid file type. Please upload a PDF or DOC/DOCX file.');
                          return;
                        }
                        setError('');
                        setFormData((prev) => ({ ...prev, portfolio: file }));
                      }}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-primary">Click to upload</span> or drag and drop
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        PDF, DOC up to 10MB
                      </div>
                    </div>
                    {formData.portfolio && (
                      <div className="mt-3 text-sm flex items-center justify-between rounded-md border border-border px-3 py-2">
                        <span className="truncate">{formData.portfolio.name}</span>
                        <button
                          type="button"
                          className="text-destructive hover:underline"
                          onClick={() => setFormData((prev) => ({ ...prev, portfolio: null }))}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Important Links */}
                  <div className="space-y-4">
                    <Label>Important Links (Optional)</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          type="url"
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="input-enhanced"
                          value={formData.links.linkedin}
                          onChange={(e) => setFormData(prev => ({
                            ...prev, 
                            links: { ...prev.links, linkedin: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="personal_website" className="text-sm">Personal Website</Label>
                        <Input
                          id="personal_website"
                          type="url"
                          placeholder="https://yourwebsite.com"
                          className="input-enhanced"
                          value={formData.links.personal_website}
                          onChange={(e) => setFormData(prev => ({
                            ...prev, 
                            links: { ...prev.links, personal_website: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="google_scholar" className="text-sm">Google Scholar</Label>
                        <Input
                          id="google_scholar"
                          type="url"
                          placeholder="https://scholar.google.com/citations?user=..."
                          className="input-enhanced"
                          value={formData.links.google_scholar}
                          onChange={(e) => setFormData(prev => ({
                            ...prev, 
                            links: { ...prev.links, google_scholar: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github" className="text-sm">GitHub</Label>
                        <Input
                          id="github"
                          type="url"
                          placeholder="https://github.com/username"
                          className="input-enhanced"
                          value={formData.links.github}
                          onChange={(e) => setFormData(prev => ({
                            ...prev, 
                            links: { ...prev.links, github: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="researchgate" className="text-sm">ResearchGate</Label>
                        <Input
                          id="researchgate"
                          type="url"
                          placeholder="https://researchgate.net/profile/username"
                          className="input-enhanced"
                          value={formData.links.researchgate}
                          onChange={(e) => setFormData(prev => ({
                            ...prev, 
                            links: { ...prev.links, researchgate: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error banner (any step) */}
            {error && (
              <div className="mt-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
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
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </EnhancedButton>
                ) : (
                  <EnhancedButton 
                    variant="hero" 
                    onClick={() => {
                      console.log('Create Account button clicked!');
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

export default StudentRegistration;