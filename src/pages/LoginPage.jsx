import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] dark:bg-gray-900 relative overflow-hidden">
      {/* Círculos decorativos de fondo */}
      <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-[-50px] w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-50px] left-[30%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg w-full max-w-md m-4 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Bienvenido
        </h2>
        
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Correo Electrónico
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
              placeholder="tu@email.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-purple-600 hover:text-purple-500"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all hover:-translate-y-0.5"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 dark:bg-gray-800/80 text-gray-500">
                o continúa con
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center px-4 py-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all"
            >
              <img
                className="h-5 w-5 mr-2"
                src="https://www.google.com/favicon.ico"
                alt="Google logo"
              />
              Google
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes una cuenta?{' '}
          <button 
            onClick={() => navigate('/dashboard')} 
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;