// src/pages/auth/SignIn.tsx
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCurrentProfile, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import gymFactoryImage from '@/assets/gymfactory.jpg';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (location.state as { from?: { pathname?: string; search?: string } } | null)?.from;
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({ title: 'Missing Information', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword(formData);
      if (error) throw error;

      const profile = await getCurrentProfile();
      if (profile) localStorage.setItem('user', JSON.stringify(profile));
      toast({ title: 'Welcome back!', description: 'You are signed in.' });
      navigate(`${redirectTo?.pathname ?? '/dashboard'}${redirectTo?.search ?? ''}`, { replace: true });
    } catch (err: any) {
      toast({
        title: 'Sign In Error',
        description: err.message || 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-y-0 right-0 hidden w-[58%] bg-primary md:block [clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-primary md:hidden" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-8">
        <div className="isolate grid w-full max-w-6xl items-stretch overflow-hidden bg-white shadow-2xl md:grid-cols-[0.95fr_1.05fr]">
          <motion.section
            layoutId="auth-photo-panel"
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 85, damping: 28, mass: 0.9 }}
            className="relative z-20 min-h-[360px] overflow-hidden bg-primary p-8 text-white md:min-h-[720px]"
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
            className="relative z-10 flex min-h-[620px] items-center justify-center bg-white px-6 py-10 sm:px-12 md:min-h-[720px] md:py-0"
          >
            <div className="w-full max-w-md">
              <div className="mb-9">
                <div className="relative">
                  <h2 className="text-4xl text-center font-black uppercase leading-[0.92] tracking-tight text-foreground">
                    Start your
                    <span className="block text-primary">fitness journey</span>
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="text-xs font-black uppercase text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => updateFormData('email', e.target.value)}
                    placeholder="Enter your Email Address"
                    className="mt-3 h-14 rounded-sm border-0 bg-muted px-5 text-base shadow-none"
                    autoComplete="username"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="text-xs font-black uppercase text-foreground">
                    Password
                  </label>
                  <div className="relative mt-3">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={e => updateFormData('password', e.target.value)}
                      placeholder="Enter your password"
                      className="h-14 rounded-sm border-0 bg-muted px-5 pr-12 text-base shadow-none"
                      autoComplete="current-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-12 w-12 hover:bg-transparent hover:text-primary"
                      onClick={() => setShowPassword(v => !v)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-3 font-semibold text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    Remember me
                  </label>
                  <Link to="#" className="font-semibold text-foreground hover:text-primary">
                    Forgot password ?
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Button
                    type="submit"
                    className="h-12 rounded-sm bg-primary text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Login'}
                  </Button>
                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    className="h-12 rounded-sm border-2 border-primary text-sm font-black uppercase tracking-wide text-primary hover:bg-primary hover:text-white"
                  >
                    <Link to="/signup" viewTransition>Sign Up</Link>
                  </Button>
                </div>
              </form>

              <p className="mt-6 text-sm font-bold leading-tight text-foreground">
                Registering to this website, you accept our Terms of Use and our Privacy Policy.
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
