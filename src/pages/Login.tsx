import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { EnhancedCard } from '@/components/EnhancedCard';
import { EnhancedButton } from '@/components/EnhancedButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthUser } from '@/hooks/useAuthUser';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [searchParams] = useSearchParams();
  const [redirectMessage, setRedirectMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { user } = useAuthUser();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setRedirectMessage(decodeURIComponent(message));
    }
  }, [searchParams]);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        setError(error.message);
      } else {
        // After login, the dashboard route will redirect based on role.
        // For professors, approval will be checked in the protected route and redirect back if not approved.
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-section flex items-center justify-center py-32">
        <div className="w-full max-w-md">
          <EnhancedCard variant="glass" className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-hero bg-clip-text text-transparent">Welcome Back</span>
              </h1>
              <p className="text-muted-foreground">Sign in to your FutureForge account</p>
            </div>

            {redirectMessage && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{redirectMessage}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="mb-6" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="input-enhanced pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                        required
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
                        placeholder="Enter your password"
                        className="input-enhanced pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                        required
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

                  <div className="flex items-center justify-between text-sm">
                    <Link to="/forgot-password" className="text-primary hover:text-primary-light transition-colors">
                      Forgot password?
                    </Link>
                  </div>

              <EnhancedButton 
                variant="hero" 
                size="lg" 
                className="w-full" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </EnhancedButton>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register/student" className="text-primary hover:text-primary-light transition-colors font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </Layout>
  );
};

export default Login;