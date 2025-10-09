import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { loginUser } from '../../store/slices/authSlice';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Mail, Lock, Eye, EyeOff, Heart } from '../../components/ui/Icons';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth) as any;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({
        email: formData.email,
        password: formData.password
      })).unwrap();
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the redux slice
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Login Form (60%) */}
        <div 
          className="w-full lg:w-[60%] flex items-center justify-center p-6 sm:p-8 md:p-12"
        >
          <div className="w-full max-w-md">
            {/* Header */}
            <div 
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                <div 
                  className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-heartbeat"
                  style={{
                    animation: 'heartbeat 1.5s ease-in-out infinite'
                  }}
                >
                  <Heart className="h-8 w-8 text-white fill-white" />
                </div>
              </div>
              <style>{`
                @keyframes heartbeat {
                  0%, 100% { transform: scale(1); }
                  25% { transform: scale(1.1); }
                  50% { transform: scale(1); }
                }
              `}</style>
              <h1 
                className="text-4xl md:text-5xl font-light mb-3 text-gray-800"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Welcome Back
              </h1>
              <p 
                className="text-gray-600 text-base md:text-lg font-light italic"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Your wellness journey continues here
              </p>
            </div>

            {/* Login Form Card with Soft Gradient */}
            <div
              className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)'
              }}
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 via-purple-100/30 to-pink-100/30"></div>
              
              <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="email" 
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300 shadow-sm"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="password" 
                    className="text-sm font-semibold text-gray-800"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300 shadow-sm"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 text-pink-500 border-gray-400 rounded focus:ring-pink-500 focus:ring-2 cursor-pointer"
                    />
                    <span 
                      className="ml-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors font-medium"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-pink-600 hover:text-pink-700 transition-all duration-200"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Error Message */}
                {error && (
                  <div 
                    className="p-4 bg-red-100 border-2 border-red-300 rounded-2xl shadow-sm"
                  >
                    <p className="text-sm text-red-700 font-semibold" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 text-base"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #8b5cf6 100%)',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" color="white" className="mr-2" />
                        Signing in...
                      </div>
                    ) : (
                      <>
                        <span className="relative z-10">Sign In</span>
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Divider */}
              <div className="relative my-6 z-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-600 font-medium rounded-full" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    New to our platform?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <Link 
                to="/onboarding"
                className="relative z-20 w-full py-3 border-2 border-pink-400 bg-white text-pink-600 font-semibold rounded-2xl hover:bg-pink-50 hover:border-pink-500 shadow-sm cursor-pointer flex items-center justify-center"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Create New Account
              </Link>
            </div>

            {/* Support Information */}
            <div 
              className="mt-8 text-center"
            >
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Need help? Call: <span className="font-semibold text-pink-600">+91-XXXX-XXXX-XX</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Available in <span className="font-medium">हिंदी | தமிழ் | English</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Wellness Video (40%) - Hidden on smaller screens */}
        <div 
          className="hidden lg:flex lg:w-[40%] bg-white"
        >
          <div className="relative w-full min-h-screen">
            {/* Video Container - Full Height */}
            <div className="absolute inset-0 overflow-hidden">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/src/assets/womenvdo.mp4" type="video/mp4" />
                {/* Fallback content */}
                <div className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
                  <p className="text-gray-600 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Wellness Video
                  </p>
                </div>
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
