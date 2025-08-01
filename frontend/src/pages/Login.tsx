import { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient'; // we'll create this
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Load user if already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        navigate('/search');
      }
    });
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setError('Invalid email or password');
    } else {
      setUser(data.user);
      toast({
        title: "Login successful",
        description: "Welcome to the Classroom Booking System",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Building className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Classroom Booking System</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-muted-foreground">Demo Credentials:</div>
            <div className="text-xs mt-2 space-y-1">
              <div>
                <strong>Admin:</strong> admin@university.edu / password123
              </div>
              <div>
                <strong>Lecturer:</strong> lecturer@university.edu / password123
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
