import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { showError, showSuccess } from '@/utils/toast';
import { useTranslation } from 'react-i18next';
import { Loader2, AlertCircle, Mail } from 'lucide-react';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export function AuthForm() {
  const [activeTab, setActiveTab] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { t } = useTranslation();

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const forgotPasswordForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const handleSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    try {
      const response = await window.ezsite.apis.login({
        email: data.email,
        password: data.password
      });

      if (response.error) {
        throw new Error(response.error);
      }

      showSuccess('Signed in successfully!');
      window.location.href = '/';
    } catch (error: any) {
      showError(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    try {
      const response = await window.ezsite.apis.register({
        email: data.email,
        password: data.password,
        name: data.name
      });

      if (response.error) {
        throw new Error(response.error);
      }

      showSuccess('Account created! Please check your email for verification.');
      signUpForm.reset();
      setActiveTab('signin');
    } catch (error: any) {
      showError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      const response = await window.ezsite.apis.sendResetPwdEmail({
        email: data.email
      });

      if (response.error) {
        throw new Error(response.error);
      }

      showSuccess('Password reset email sent! Please check your inbox.');
      setShowForgotPassword(false);
      forgotPasswordForm.reset();
    } catch (error: any) {
      showError(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {t('auth.resetPassword')}
          </CardTitle>
          <CardDescription>
            {t('auth.resetPasswordDescription')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="your@email.com"
                {...forgotPasswordForm.register('email')}
                disabled={isLoading} />

              {forgotPasswordForm.formState.errors.email &&
              <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {forgotPasswordForm.formState.errors.email.message}
                  </AlertDescription>
                </Alert>
              }
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}>

              {isLoading ?
              <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </> :

              'Send Reset Link'
              }
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setShowForgotPassword(false)}
              disabled={isLoading}>

              {t('auth.backToSignIn')}
            </Button>
          </CardFooter>
        </form>
      </Card>);

  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={signInForm.handleSubmit(handleSignIn)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">{t('auth.email')}</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  {...signInForm.register('email')}
                  disabled={isLoading} />

                {signInForm.formState.errors.email &&
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {signInForm.formState.errors.email.message}
                    </AlertDescription>
                  </Alert>
                }
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  {...signInForm.register('password')}
                  disabled={isLoading} />

                {signInForm.formState.errors.password &&
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {signInForm.formState.errors.password.message}
                    </AlertDescription>
                  </Alert>
                }
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}>

                {isLoading ?
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </> :

                'Sign In'
                }
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-sm"
                onClick={() => setShowForgotPassword(true)}
                disabled={isLoading}>

                Forgot your password?
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Create a new account to access our financial data platform
            </CardDescription>
          </CardHeader>
          <form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  {...signUpForm.register('name')}
                  disabled={isLoading} />

                {signUpForm.formState.errors.name &&
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {signUpForm.formState.errors.name.message}
                    </AlertDescription>
                  </Alert>
                }
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  {...signUpForm.register('email')}
                  disabled={isLoading} />

                {signUpForm.formState.errors.email &&
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {signUpForm.formState.errors.email.message}
                    </AlertDescription>
                  </Alert>
                }
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  {...signUpForm.register('password')}
                  disabled={isLoading} />

                {signUpForm.formState.errors.password &&
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {signUpForm.formState.errors.password.message}
                    </AlertDescription>
                  </Alert>
                }
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}>

                {isLoading ?
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </> :

                'Create Account'
                }
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>);

}