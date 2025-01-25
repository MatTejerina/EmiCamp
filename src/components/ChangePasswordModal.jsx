import React, { useState, useEffect } from 'react';



const ChangePasswordModal = ({ show, onClose, onPasswordChange, isGenericPassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');

  // Obtener el email del token al abrir el modal
  useEffect(() => {
      const idToken = localStorage.getItem('idToken');
      if (idToken) {
        try {
          const tokenPayload = JSON.parse(atob(idToken.split('.')[1]));
          if (tokenPayload.email) {
            setEmail(tokenPayload.email);
          }
        } catch (err) {
          console.error('Error al decodificar el token:', err);
        }
      }
    
  }, [true]);
  const handleSubmit = (e) => {
    e.preventDefault();
    onPasswordChange({ email ,currentPassword, newPassword }); // Enviar datos al backend
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Cambiar Contraseña
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isGenericPassword ? "Dni" : "Contraseña Actual"}
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder={isGenericPassword ? "Ingrese su Dni" : "Escribe tu contraseña actual"}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Escribe tu nueva contraseña"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 focus:outline-none"
            >
              Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
