import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { DATABASE_URL } from '../config/config';

const RecoverPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Obtener el email del token al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const idToken = localStorage.getItem('idToken');
      if (idToken) {
        try {
          const tokenPayload = JSON.parse(atob(idToken.split('.')[1]));
          console.log('Token payload:', tokenPayload);
          if (tokenPayload.email) {
            setEmail(tokenPayload.email);
          }
        } catch (err) {
          console.error('Error al decodificar el token:', err);
        }
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Por favor ingrese un correo electrónico válido');
        setLoading(false);
        return;
      }

      const requestBody = { email };
      console.log('Request body:', JSON.stringify(requestBody));

      // Obtener el token de acceso
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No hay sesión activa. Por favor inicie sesión nuevamente.');
        setLoading(false);
        return;
      }

      console.log('Token encontrado:', accessToken);

      const response = await fetch(`${DATABASE_URL}/api/Auth/recover-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestBody),
      });

      console.log('URL completa:', `${DATABASE_URL}/api/Auth/recover-password`);
      console.log('Headers enviados:', {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      });
      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
          console.log('Respuesta exitosa:', data);
          setSuccess(data.status || 'Solicitud enviada al administrador.');
        } else {
          setSuccess('Solicitud enviada al administrador.');
        }
        
        setEmail('');
        setTimeout(() => onClose(), 2000);
      } else {
        if (response.status === 404) {
          try {
            const errorBody = await response.text();
            console.error('Cuerpo de la respuesta 404:', errorBody);
            setError('El correo electrónico no está registrado en el sistema');
          } catch (err) {
            console.error('No se pudo leer el cuerpo de la respuesta');
            setError('Error al procesar la respuesta del servidor');
          }
        } else if (response.status === 401) {
          setError('No autorizado. Por favor inicie sesión nuevamente.');
        } else {
          let errorMessage;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || 'Error al enviar la solicitud';
            console.error('Error data:', errorData);
          } catch {
            errorMessage = 'Error al enviar la solicitud';
          }
          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError('Error al conectar con el servidor. Por favor intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recuperar Contraseña</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
                error ? 'border-red-500' : ''
              }`}
              placeholder="tu@email.com"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg p-3 text-sm">
              {success}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    userName: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecoverModalOpen, setIsRecoverModalOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Generar un state aleatorio para prevenir CSRF
  const generateState = () => {
    const array = new Uint32Array(8);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Token decodificado:', JSON.parse(atob(credentialResponse.credential.split('.')[1])));

      const requestBody = {
        idTokenGoogle: credentialResponse.credential.trim(),
        redirectUri: 'http://localhost:5173'
      };

      console.log('Request Body:', requestBody);

      const response = await fetch(`${DATABASE_URL}/api/Auth/loginSSO`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      // Para debug: mostrar la respuesta completa
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.errors) {
            const messages = Object.entries(errorData.errors)
              .map(([key, value]) => `${key}: ${value.join(', ')}`)
              .join('\n');
            throw new Error(`Errores de validación:\n${messages}`);
          }
          throw new Error(errorData.message || errorData.title || 'Error desconocido');
        } catch (e) {
          throw new Error(`Error en la respuesta: ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('Login successful:', data);
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('idToken', data.idToken);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar la respuesta de Google
  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');

      // Verificar si estamos en la ruta de callback
      if (!location.pathname.includes('/auth/callback')) return;

      // Verificar si hay error
      if (error) {
        setError('Error en la autenticación con Google');
        navigate('/');
        return;
      }

      // Verificar el state para prevenir CSRF
      const savedState = localStorage.getItem('oauth_state');
      if (state !== savedState) {
        setError('Error de seguridad en la autenticación');
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${DATABASE_URL}/api/Auth/loginSSO`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            redirectUri: 'http://localhost:5173/auth/callback'
          })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('idToken', data.idToken);
          navigate('/dashboard');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al iniciar sesión');
          navigate('/');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error al conectar con el servidor');
        navigate('/');
      } finally {
        setLoading(false);
        localStorage.removeItem('oauth_state');
      }
    };

    handleCallback();
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    const errors = {
      userName: '',
      password: ''
    };
    let isValid = true;

    if (!formData.userName.trim()) {
      errors.userName = 'El usuario es requerido';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    if (!isValid) {
      setErrors(errors);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${DATABASE_URL}/api/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userName: formData.userName,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Guardar solo los tokens necesarios
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('idToken', data.idToken);
        
        navigate('/dashboard');
      } else {
        if (response.status === 401) {
          setError('Usuario o contraseña incorrectos');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al iniciar sesión');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuario recordado al montar el componente
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setFormData(prev => ({ ...prev, userName: rememberedUser }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <TextField
                id="userName"
                name="userName"
                type="text"
                autoComplete="username"
                required
                fullWidth
                label="Usuario"
                value={formData.userName}
                onChange={(e) => {
                  setFormData({...formData, userName: e.target.value});
                  if (errors.userName) setErrors({...errors, userName: ''});
                }}
                error={!!errors.userName}
                helperText={errors.userName}
                sx={{ mb: 2 }}
              />
            </div>
            <div>
              <TextField
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                fullWidth
                label="Contraseña"
                value={formData.password}
                onChange={(e) => {
                  setFormData({...formData, password: e.target.value});
                  if (errors.password) setErrors({...errors, password: ''});
                }}
                error={!!errors.password}
                helperText={errors.password}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Recordar usuario
              </label>
            </div>
            
            <button
              type="button"
              onClick={() => setIsRecoverModalOpen(true)}
              className="text-sm text-purple-600 hover:text-purple-500"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                O continuar con
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={(error) => {
                console.error('Google Login Error:', error);
                setError('Error al iniciar sesión con Google');
              }}
              useOneTap={false}
              cookiePolicy={'strict'}
              prompt="select_account"
              theme="outline"
              size="large"
              shape="rectangular"
              locale="es"
              text="signin_with"
              width="300"
              context="signin"
              itp_support={true}
            />
          </div>
        </div>
      </div>

      <RecoverPasswordModal
        isOpen={isRecoverModalOpen}
        onClose={() => setIsRecoverModalOpen(false)}
      />
    </div>
  );
};

export default LoginPage;