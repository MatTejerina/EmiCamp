import { DATABASE_URL } from '../config/config';

const RecoverPasswordModal = ({ isOpen, onClose }) => {
  // ... estados y otras funciones ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${DATABASE_URL}/api/Auth/recover-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ email })
      });

      // ... resto del código ...
    } catch (err) {
      // ... manejo de errores ...
    }
  };

  // ... resto del componente ...
}; 