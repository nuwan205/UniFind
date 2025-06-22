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
import { UserPlus, Mail, Lock, User, Loader2, School, Phone, GraduationCap, Calendar } from 'lucide-react';

// Update the interface to match RegisterDto
interface SignUpForm {
  email: string;
  password: string;
  name: string;
  age: number;
  phone: string;
  faculty: string;
  status: number;
}

interface SignUpDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SignUpDialog = ({ open, onOpenChange }: SignUpDialogProps) => {
  // Update state to match new form fields
  const [formData, setFormData] = useState<SignUpForm>({
    email: '',
    password: '',
    name: '',
    age: 0,
    phone: '',
    faculty: '',
    status:1
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const authService = new AuthService();

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.signUp(formData);
      if (response.status) {
        setIsOpen(false);
        setFormData({
          email: '',
          password: '',
          name: '',
          age: 0,
          phone: '',
          faculty: '',
          status:1
        });
        setConfirmPassword('');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="outline" className="border-2 border-teal-500 text-teal-600 hover:bg-teal-500 hover:text-white px-6 py-3 rounded-full transition-all duration-300">
            <UserPlus className="h-4 w-4 mr-2" />
            Sign Up
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-teal-600 via-purple-600 to-teal-600 bg-clip-text text-transparent pb-2">
            Join UniFind
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Create your account to start finding lost items
          </DialogDescription>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Name Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Full Name
                  </label>
                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Age Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Age
                  </label>
                  <Input
                    name="age"
                    type="number"
                    value={formData.age || ''}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter your age"
                    min="1"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Phone Number
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="+94771234567"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Academic Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Academic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Faculty Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    Faculty
                  </label>
                  <Input
                    name="faculty"
                    type="text"
                    value={formData.faculty}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter your faculty"
                    required
                  />
                </div>

                {/* You can add more academic fields here if needed */}
                <div className="hidden sm:block"></div>
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Security</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Password Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    Password
                  </label>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Error Display */}
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 via-purple-500 to-teal-500 hover:from-teal-600 hover:via-purple-600 hover:to-teal-600 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Create Account
                </>
              )}
            </Button>

            {/* Sign In Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                type="button" 
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Sign in instead
              </button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};