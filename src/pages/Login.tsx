import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/pbAuthStore';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('communicationprimacenter@gmail.com');
  const [password, setPassword] = useState('Pr!ma@center#2025');
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // Effacer les erreurs précédentes
    
    try {
      await login(email, password);
      if (useAuthStore.getState().isAuthenticated) {
        navigate('/admin');
      }
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getErrorMessage = (error: string | null) => {
    if (!error) return null;
    
    if (error.includes('400') || error.includes('Failed to authenticate')) {
      return {
        type: 'error',
        title: 'Identifiants incorrects',
        message: 'L\'email ou le mot de passe est incorrect. Veuillez vérifier vos informations.',
        icon: AlertCircle
      };
    }
    
    if (error.includes('Network') || error.includes('fetch')) {
      return {
        type: 'error',
        title: 'Problème de connexion',
        message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
        icon: AlertCircle
      };
    }
    
    return {
      type: 'error',
      title: 'Erreur de connexion',
      message: error,
      icon: AlertCircle
    };
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5DC] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8 bg-white p-8 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-ogg text-[#2C2C2C]">
            Connexion
          </h2>
          <p className="mt-2 text-center text-sm font-sofia text-gray-600">
            Connectez-vous à votre compte administrateur
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 font-sofia rounded-md focus:outline-none focus:ring-[#2C2C2C] focus:border-[#2C2C2C] focus:z-10 sm:text-sm"
                placeholder="Adresse e-mail"
              />
            </div>
            
            {/* Champ Mot de passe avec bouton masquer/démasquer */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 font-sofia rounded-md focus:outline-none focus:ring-[#2C2C2C] focus:border-[#2C2C2C] focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Message d'erreur amélioré */}
          {errorInfo && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-md p-4"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errorInfo.title}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errorInfo.message}</p>
                    {loginAttempts > 2 && (
                      <p className="mt-1 text-xs">
                        💡 Astuce : Vérifiez que vous utilisez le bon mot de passe
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Informations de connexion */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Informations de connexion
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p><strong>Email :</strong> communicationprimacenter@gmail.com</p>
                  <p><strong>Mot de passe :</strong> Pr!ma@center#2025</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2C2C2C] hover:bg-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C2C2C] transition-colors duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion en cours...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login; 
