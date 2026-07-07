// src/pages/auth/SignUp.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentProfile, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const fitnessLevels = [
  { value: 'beginner', label: 'Beginner - New to fitness' },
  { value: 'intermediate', label: 'Intermediate - Some experience' },
  { value: 'advanced', label: 'Advanced - Very experienced' },
  { value: 'athlete', label: 'Athlete - Competitive level' },
];

const fitnessGoals = [
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'muscle-gain', label: 'Muscle Gain' },
  { value: 'strength', label: 'Strength Building' },
  { value: 'endurance', label: 'Endurance Training' },
  { value: 'general', label: 'General Fitness' },
  { value: 'athletic', label: 'Athletic Performance' },
];

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fitnessLevel: '',
    goals: '',
  });

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.fitnessLevel ||
      !formData.goals
    ) {
      toast({ title: 'Missing Information', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Password Mismatch', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }
    if (formData.password.length < 8) {
      toast({ title: 'Weak Password', description: 'Password must be at least 8 characters long.', variant: 'destructive' });
      return;
    }
    if (!agreeToTerms) {
      toast({ title: 'Terms Not Accepted', description: 'You must agree to Terms of Service.', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone_number: formData.phone,
            fitness_level: formData.fitnessLevel,
            primary_goal: formData.goals,
          },
        },
      });
      if (error) throw error;

      const profile = await getCurrentProfile();
      if (profile) localStorage.setItem('user', JSON.stringify(profile));
      toast({ title: 'Welcome to FitTrainer Pro! 🎉', description: 'Your account has been created.' });
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Registration Error', description: err.message || 'Error creating account.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-power/5 to-energy/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">FitTrainer Pro</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Start Your Journey</h1>
          <p className="text-muted-foreground">Create your account and begin transforming your fitness</p>
        </div>
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-semibold">First Name *</Label>
                  <Input id="firstName" value={formData.firstName} onChange={e => updateFormData('firstName', e.target.value)} placeholder="Enter first name" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-semibold">Last Name *</Label>
                  <Input id="lastName" value={formData.lastName} onChange={e => updateFormData('lastName', e.target.value)} placeholder="Enter last name" className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={e => updateFormData('email', e.target.value)} placeholder="you@example.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={e => updateFormData('phone', e.target.value)} placeholder="(555) 123-4567" className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password" className="text-sm font-semibold">Password *</Label>
                  <div className="relative mt-1">
                    <Input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => updateFormData('password', e.target.value)} placeholder="Create a strong password" />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full w-10" onClick={() => setShowPassword(v => !v)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password *</Label>
                  <div className="relative mt-1">
                    <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={e => updateFormData('confirmPassword', e.target.value)} placeholder="Confirm your password" />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full w-10" onClick={() => setShowConfirmPassword(v => !v)}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fitnessLevel" className="text-sm font-semibold">Fitness Level *</Label>
                  <Select value={formData.fitnessLevel} onValueChange={val => updateFormData('fitnessLevel', val)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>{fitnessLevels.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="goals" className="text-sm font-semibold">Primary Goal *</Label>
                  <Select value={formData.goals} onValueChange={val => updateFormData('goals', val)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select goal" /></SelectTrigger>
                    <SelectContent>{fitnessGoals.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <input type="checkbox" id="terms" className="mt-1 rounded border-gray-300" checked={agreeToTerms} onChange={e => setAgreeToTerms(e.target.checked)} required />
                <label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the <Link to="#" className="text-primary hover:text-primary/80">Terms of Service</Link> and <Link to="#" className="text-primary hover:text-primary/80">Privacy Policy</Link>.
                </label>
              </div>
              <Button type="submit" variant="energy" className="w-full">Create My Account</Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/signin" className="text-primary hover:text-primary/80 font-medium">Sign in here</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
