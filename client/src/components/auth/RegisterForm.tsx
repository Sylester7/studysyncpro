import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginWithGoogle, registerWithEmail } = useAuth();
  const [, navigate] = useLocation();

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      await loginWithGoogle();
      navigate('/student/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to sign up with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!firstName || !lastName || !email || !password || !role) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      const displayName = `${firstName} ${lastName}`;
      await registerWithEmail(email, password, displayName);
      // Ideally, we'd also save the role in the user's profile or database
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please sign in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format. Please check your email.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError('Failed to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Sign up for your StudySync account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Button
            variant="outline"
            type="button"
            disabled={loading}
            className="w-full flex items-center justify-center"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            {loading ? 'Signing up...' : 'Sign up with Google'}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="John" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Doe" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your.email@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Password must be at least 6 characters
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">I am a</Label>
            <Select 
              value={role} 
              onValueChange={setRole} 
              disabled={loading}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <a 
              className="underline text-primary-600 dark:text-primary-400 cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Sign in
            </a>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
