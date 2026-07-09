// src/pages/auth/SignUp.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCurrentProfile, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import gymFactoryImage from '@/assets/gymfactory.jpg';

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

const fieldClass =
  'mt-3 h-12 rounded-sm border-0 bg-muted px-4 text-base shadow-none';

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
      toast({ title: 'Welcome to Gym Factory!', description: 'Your account has been created.' });
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Registration Error', description: err.message || 'Error creating account.', variant: 'destructive' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-y-0 right-0 hidden w-[58%] bg-primary md:block [clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-primary md:hidden" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-8">
        <div className="isolate grid w-full max-w-6xl items-stretch overflow-hidden bg-white shadow-2xl md:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            layoutId="auth-photo-panel"
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 85, damping: 28, mass: 0.9 }}
            className="order-2 relative z-20 min-h-[360px] overflow-hidden bg-primary md:order-2 md:min-h-[720px]"
          >
            <img
              src={gymFactoryImage}
              alt="Athlete training at Gym Factory"
              loading="eager"
              decoding="sync"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.section>

          <motion.section
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 order-1 flex min-h-[620px] items-center justify-center bg-white px-6 py-10 sm:px-10 md:min-h-[720px] md:py-0"
          >
            <div className="w-full max-w-xl">
              <div className="mb-7 text-center">
                <h1 className="text-4xl font-black uppercase leading-[0.92] tracking-tight text-foreground">
                  Build your
                  <span className="block text-primary">member profile</span>
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="text-xs font-black uppercase text-foreground">
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={e => updateFormData('firstName', e.target.value)}
                      placeholder="Enter first name"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="text-xs font-black uppercase text-foreground">
                      Last Name *
                    </label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={e => updateFormData('lastName', e.target.value)}
                      placeholder="Enter last name"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="text-xs font-black uppercase text-foreground">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => updateFormData('email', e.target.value)}
                      placeholder="you@example.com"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-xs font-black uppercase text-foreground">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={e => updateFormData('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="text-xs font-black uppercase text-foreground">
                      Password *
                    </label>
                    <div className="relative mt-3">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={e => updateFormData('password', e.target.value)}
                        placeholder="Create a strong password"
                        className="h-12 rounded-sm border-0 bg-muted px-4 pr-12 text-base shadow-none"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-10 w-10 hover:bg-transparent hover:text-primary"
                        onClick={() => setShowPassword(v => !v)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="text-xs font-black uppercase text-foreground">
                      Confirm Password *
                    </label>
                    <div className="relative mt-3">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={e => updateFormData('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
                        className="h-12 rounded-sm border-0 bg-muted px-4 pr-12 text-base shadow-none"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-10 w-10 hover:bg-transparent hover:text-primary"
                        onClick={() => setShowConfirmPassword(v => !v)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fitnessLevel" className="text-xs font-black uppercase text-foreground">
                      Fitness Level *
                    </label>
                    <Select value={formData.fitnessLevel} onValueChange={val => updateFormData('fitnessLevel', val)}>
                      <SelectTrigger className="mt-3 h-12 rounded-sm border-0 bg-muted px-4 shadow-none">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {fitnessLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="goals" className="text-xs font-black uppercase text-foreground">
                      Primary Goal *
                    </label>
                    <Select value={formData.goals} onValueChange={val => updateFormData('goals', val)}>
                      <SelectTrigger className="mt-3 h-12 rounded-sm border-0 bg-muted px-4 shadow-none">
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        {fitnessGoals.map(goal => (
                          <SelectItem key={goal.value} value={goal.value}>{goal.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <label className="flex items-start gap-3 text-sm font-semibold leading-relaxed text-foreground">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm ${agreeToTerms ? 'bg-primary text-white' : 'bg-muted text-transparent'}`}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="checkbox"
                    id="terms"
                    className="sr-only"
                    checked={agreeToTerms}
                    onChange={e => setAgreeToTerms(e.target.checked)}
                    required
                  />
                  <span>
                    I agree to the <Link to="#" className="text-primary hover:text-primary/80">Terms of Service</Link> and <Link to="#" className="text-primary hover:text-primary/80">Privacy Policy</Link>.
                  </span>
                </label>

                <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                  <Button
                    type="submit"
                    className="h-12 rounded-sm bg-primary text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
                  >
                    Create Account
                  </Button>
                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    className="h-12 rounded-sm border-2 border-primary text-sm font-black uppercase tracking-wide text-primary hover:bg-primary hover:text-white"
                  >
                    <Link to="/signin" viewTransition>Sign In</Link>
                  </Button>
                </div>
              </form>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
