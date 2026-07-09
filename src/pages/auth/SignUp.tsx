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
  'mt-2 h-11 rounded-sm border-0 bg-muted px-4 text-left text-sm shadow-none';
const fieldErrorClass = 'ring-2 ring-destructive/70 focus-visible:ring-destructive';
const errorTextClass = 'mt-1 text-[11px] font-semibold leading-tight text-destructive';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  fitnessLevel: string;
  goals: string;
};

type FormErrors = Partial<Record<keyof FormData | 'terms', string>>;

const namePattern = /^[A-Za-z\s]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const lebanonPhonePattern = /^\+961\d{7,8}$/;

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fitnessLevel: '',
    goals: '',
  });

  const getFieldClass = (field: keyof FormData, className = fieldClass) =>
    `${className} ${errors[field] ? fieldErrorClass : ''}`;

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!firstName) nextErrors.firstName = 'First name required.';
    else if (firstName.length < 2) nextErrors.firstName = 'Use 2+ letters.';
    else if (!namePattern.test(firstName)) nextErrors.firstName = 'Letters only, no symbols.';

    if (!lastName) nextErrors.lastName = 'Last name required.';
    else if (lastName.length < 2) nextErrors.lastName = 'Use 2+ letters.';
    else if (!namePattern.test(lastName)) nextErrors.lastName = 'Letters only, no symbols.';

    if (!email) nextErrors.email = 'Email required.';
    else if (!emailPattern.test(email)) nextErrors.email = 'Enter a valid email.';

    if (phone && !lebanonPhonePattern.test(phone)) {
      nextErrors.phone = 'Use +961 plus 7-8 digits.';
    }

    if (!formData.password) nextErrors.password = 'Password required.';
    else if (formData.password.length < 8) nextErrors.password = 'Use 8+ characters.';
    else if (!/[A-Z]/.test(formData.password)) nextErrors.password = 'Add uppercase letter.';
    else if (!/[a-z]/.test(formData.password)) nextErrors.password = 'Add lowercase letter.';
    else if (!/\d/.test(formData.password)) nextErrors.password = 'Add a number.';
    else if (!/[^A-Za-z0-9]/.test(formData.password)) nextErrors.password = 'Add special character.';

    if (!formData.confirmPassword) nextErrors.confirmPassword = 'Confirm password.';
    else if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords must match.';

    if (!formData.fitnessLevel) nextErrors.fitnessLevel = 'Select fitness level.';
    if (!formData.goals) nextErrors.goals = 'Select primary goal.';
    if (!agreeToTerms) nextErrors.terms = 'Agree to terms and policies.';

    return nextErrors;
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      if (!prev[field]) return prev;
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast({ title: 'Check Your Details', description: 'Please fix the highlighted fields.', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            phone_number: formData.phone.trim(),
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
            className="relative z-10 order-1 flex min-h-[620px] items-center justify-center bg-white px-6 py-8 sm:px-10 md:min-h-[720px] md:py-6"
          >
            <div className="w-full max-w-xl">
              <div className="mb-5 text-center">
                <h1 className="text-4xl font-black uppercase leading-[0.92] tracking-tight text-foreground">
                  Build your
                  <span className="block text-primary">member profile</span>
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 pb-6 text-left">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="text-xs font-black uppercase text-foreground">
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={e => updateFormData('firstName', e.target.value)}
                      placeholder="Enter first name"
                      className={getFieldClass('firstName')}
                      aria-invalid={Boolean(errors.firstName)}
                    />
                    {errors.firstName && <p className={errorTextClass}>{errors.firstName}</p>}
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
                      className={getFieldClass('lastName')}
                      aria-invalid={Boolean(errors.lastName)}
                    />
                    {errors.lastName && <p className={errorTextClass}>{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                      className={getFieldClass('email')}
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && <p className={errorTextClass}>{errors.email}</p>}
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
                      placeholder="+961"
                      className={getFieldClass('phone')}
                      inputMode="tel"
                      aria-invalid={Boolean(errors.phone)}
                    />
                    {errors.phone && <p className={errorTextClass}>{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="text-xs font-black uppercase text-foreground">
                      Password *
                    </label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={e => updateFormData('password', e.target.value)}
                        placeholder="Create a strong password"
                        className={getFieldClass('password', 'h-11 rounded-sm border-0 bg-muted px-4 pr-12 text-left text-sm shadow-none')}
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.password)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-0.5 h-10 w-10 hover:bg-transparent hover:text-primary"
                        onClick={() => setShowPassword(v => !v)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && <p className={errorTextClass}>{errors.password}</p>}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="text-xs font-black uppercase text-foreground">
                      Confirm Password *
                    </label>
                    <div className="relative mt-2">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={e => updateFormData('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
                        className={getFieldClass('confirmPassword', 'h-11 rounded-sm border-0 bg-muted px-4 pr-12 text-left text-sm shadow-none')}
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.confirmPassword)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-0.5 h-10 w-10 hover:bg-transparent hover:text-primary"
                        onClick={() => setShowConfirmPassword(v => !v)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && <p className={errorTextClass}>{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fitnessLevel" className="text-xs font-black uppercase text-foreground">
                      Fitness Level *
                    </label>
                    <Select value={formData.fitnessLevel} onValueChange={val => updateFormData('fitnessLevel', val)}>
                      <SelectTrigger
                        className={getFieldClass('fitnessLevel', 'mt-2 h-11 rounded-sm border-0 bg-muted pl-3 pr-4 text-left text-sm shadow-none [&>span]:text-left')}
                        aria-invalid={Boolean(errors.fitnessLevel)}
                      >
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {fitnessLevels.map(level => (
                          <SelectItem
                            key={level.value}
                            value={level.value}
                            className="pl-3 pr-8 [&>span:first-child]:left-auto [&>span:first-child]:right-2"
                          >
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.fitnessLevel && <p className={errorTextClass}>{errors.fitnessLevel}</p>}
                  </div>
                  <div>
                    <label htmlFor="goals" className="text-xs font-black uppercase text-foreground">
                      Primary Goal *
                    </label>
                    <Select value={formData.goals} onValueChange={val => updateFormData('goals', val)}>
                      <SelectTrigger
                        className={getFieldClass('goals', 'mt-2 h-11 rounded-sm border-0 bg-muted pl-3 pr-4 text-left text-sm shadow-none [&>span]:text-left')}
                        aria-invalid={Boolean(errors.goals)}
                      >
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        {fitnessGoals.map(goal => (
                          <SelectItem
                            key={goal.value}
                            value={goal.value}
                            className="pl-3 pr-8 [&>span:first-child]:left-auto [&>span:first-child]:right-2"
                          >
                            {goal.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.goals && <p className={errorTextClass}>{errors.goals}</p>}
                  </div>
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm font-semibold leading-relaxed text-foreground">
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm ${agreeToTerms ? 'bg-primary text-white' : 'bg-muted text-transparent'} ${errors.terms ? 'ring-2 ring-destructive/70' : ''}`}>
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="checkbox"
                      id="terms"
                      className="sr-only"
                      checked={agreeToTerms}
                      onChange={e => {
                        setAgreeToTerms(e.target.checked);
                        setErrors(prev => {
                          if (!prev.terms) return prev;
                          const { terms: _removed, ...rest } = prev;
                          return rest;
                        });
                      }}
                      aria-invalid={Boolean(errors.terms)}
                    />
                    <span>
                      I agree to the <Link to="#" className="text-primary hover:text-primary/80">Terms of Service</Link> and <Link to="#" className="text-primary hover:text-primary/80">Privacy Policy</Link>.
                    </span>
                  </label>
                  {errors.terms && (
                    <div className="relative -ml-2 mt-2 w-fit max-w-[min(100%,24rem)] rounded-sm border border-destructive/30 bg-destructive px-3 py-1.5 text-[11px] font-bold leading-tight text-destructive-foreground shadow-lg shadow-destructive/20 before:absolute before:-top-1.5 before:left-3 before:h-3 before:w-3 before:rotate-45 before:border-l before:border-t before:border-destructive/30 before:bg-destructive">
                      {errors.terms}
                    </div>
                  )}
                </div>

                <div className="grid gap-3 pt-1 sm:grid-cols-[1.15fr_0.85fr]">
                  <Button
                    type="submit"
                    className="h-11 rounded-sm bg-primary text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
                  >
                    Create Account
                  </Button>
                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    className="h-11 rounded-sm border-2 border-primary text-sm font-black uppercase tracking-wide text-primary hover:bg-primary hover:text-white"
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
