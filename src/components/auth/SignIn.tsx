import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AuthService } from '../../services/auth.service';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { SignUpDialog } from './SignUp';

interface SignInDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SignInDialog = ({ open, onOpenChange }: SignInDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const authService = new AuthService();

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.signIn({ email, password });
      if (response.status) {
        setIsOpen(false);
        setEmail('');
        setPassword('');
        // Add window reload after successful sign in
        window.location.reload();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle switching to signup
  const handleSwitchToSignUp = () => {
    setIsOpen(false); // Close SignIn
    setIsSignUpOpen(true); // Open SignUp
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {!isControlled && (
          <DialogTrigger asChild>
            <Button variant="outline" className="border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white px-6 py-3 rounded-full transition-all duration-300">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-teal-600 via-purple-600 to-teal-600 bg-clip-text text-transparent pb-2">
              Welcome Back
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Sign in to your account to continue your journey
            </DialogDescription>
          </DialogHeader>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-500" />
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-500 focus:ring-purple-500" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-purple-600 hover:text-purple-700 transition-colors">
                  Forgot password?
                </button>
              </div>

              {error && (
                <motion.p 
                  className="text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 via-purple-500 to-teal-500 hover:from-teal-600 hover:via-purple-600 hover:to-teal-600 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </>
                )}
              </Button>

              <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  type="button" 
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  onClick={handleSwitchToSignUp}
                >
                  Sign up now
                </button>
              </div>
            </form>
          </motion.div>
        </DialogContent>
      </Dialog>

      <SignUpDialog 
        open={isSignUpOpen} 
        onOpenChange={(open) => {
          setIsSignUpOpen(open);
          if (!open) {
            // Optionally reopen sign in when signup closes
            setIsOpen(true);
          }
        }} 
      />
    </>
  );
};