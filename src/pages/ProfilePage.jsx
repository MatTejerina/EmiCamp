import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import PageBackground from '../components/PageBackground';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { DATABASE_URL } from '../config/config';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [editedData, setEditedData] = useState({
    numberPhone: '',
    email: '',
    backupEmail: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const idToken = localStorage.getItem('idToken');
        
        if (!accessToken || !idToken) {
          throw new Error('No se encontraron los tokens de autenticación');
        }

        // Usar el ID directamente
        const profileUrl = `${DATABASE_URL}/api/Collaborator/29`;

        const profileResponse = await fetch(profileUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.message || 'Error al obtener datos del usuario');
          } catch (e) {
            throw new Error('Error al obtener datos del usuario');
          }
        }

        const data = await profileResponse.json();
        if (!data) {
          throw new Error('No se recibieron datos del usuario');
        }

        setUserData(data);
      } catch (error) {
        setError(error.message || 'Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      setEditedData({
        numberPhone: userData.numberPhone || '',
        email: userData.email || '',
        backupEmail: userData.backupEmail || ''
      });
    }
  }, [userData]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const handlePasswordSubmit = async () => {
    try {
      // Validar que las contraseñas coincidan
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('Las contraseñas nuevas no coinciden');
        return;
      }

      // Validar que la contraseña no esté vacía
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        setPasswordError('Todos los campos son obligatorios');
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      const idToken = localStorage.getItem('idToken');
      
      if (!accessToken || !idToken) {
        throw new Error('No se encontraron los tokens de autenticación');
      }

      // Obtener el email del token
      const tokenPayload = JSON.parse(atob(idToken.split('.')[1]));
      const userEmail = tokenPayload.email;

      const response = await fetch(`${DATABASE_URL}/api/User/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar la contraseña');
      }

      // Limpiar el formulario y cerrar el diálogo
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setOpenPasswordDialog(false);
      
      // Mostrar mensaje de éxito con Snackbar
      setSnackbarMessage('Contraseña actualizada exitosamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

    } catch (error) {
      setPasswordError(error.message || 'Error al cambiar la contraseña');
      setSnackbarMessage(error.message || 'Error al cambiar la contraseña');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Crear el objeto de datos a enviar
      const dataToSend = {
        ...userData,
        ...editedData
      };

      const response = await fetch(`${DATABASE_URL}/api/Collaborator/27`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Status:', response.status);
        console.error('Response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Error al actualizar el perfil');
        } catch (e) {
          throw new Error(`Error al actualizar el perfil. Status: ${response.status}`);
        }
      }

      // Si la respuesta está vacía pero fue exitosa (status 200-299)
      setUserData(prev => ({
        ...prev,
        ...editedData
      }));
      setIsEditing(false);
      setSnackbarMessage('Perfil actualizado exitosamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error completo:', error);
      setSnackbarMessage(error.message || 'Error al actualizar el perfil');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setUploading(true);
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          throw new Error('No se encontró el token de acceso');
        }

        // Crear FormData
        const formData = new FormData();
        formData.append('image', file);
        formData.append('fileName', file.name);
        formData.append('contentType', file.type);
        formData.append('name', userData.name);
        formData.append('lastName', userData.lastName);
        formData.append('email', userData.email);
        formData.append('backupEmail', userData.backupEmail);
        formData.append('numberPhone', userData.numberPhone);
        formData.append('documentType', userData.documentType);

        console.log('Datos a enviar:', Object.fromEntries(formData));

        // Subir la imagen
        const imageResponse = await fetch(`${DATABASE_URL}/api/Collaborator/PutImages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            // No incluir Content-Type, dejamos que el navegador lo establezca con el boundary correcto
          },
          body: formData
        });

        // Agregar logs para depuración
        console.log('URL:', `${DATABASE_URL}/api/Collaborator/PutImages`);
        console.log('Status:', imageResponse.status);
        console.log('Headers:', {
          'Authorization': `Bearer ${accessToken}`
        });

        const responseText = await imageResponse.text();
        console.log('Respuesta completa:', responseText);

        if (!imageResponse.ok) {
          try {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.message || 'Error al subir la imagen');
          } catch (e) {
            throw new Error(`Error al subir la imagen. Status: ${imageResponse.status}. Response: ${responseText}`);
          }
        }

        // Obtener la ruta de la imagen
        const imagePath = responseText;

        // Actualizar el perfil con la nueva ruta de la imagen
        const updateResponse = await fetch(`${DATABASE_URL}/api/Collaborator/27`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...userData,
            photo: imagePath
          })
        });

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          console.error('Error en la actualización del perfil:', errorText);
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.message || 'Error al actualizar el perfil con la nueva imagen');
          } catch (e) {
            throw new Error('Error al actualizar el perfil con la nueva imagen');
          }
        }

        // Actualizar el estado local
        setUserData(prev => ({
          ...prev,
          photo: imagePath
        }));

        setSnackbarMessage('Imagen de perfil actualizada exitosamente');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error completo:', error);
        setSnackbarMessage(error.message || 'Error al actualizar la imagen de perfil');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="relative p-6">
      <PageBackground />
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(to right, #9333ea, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}
      >
        Mi Perfil
      </Typography>

      <Paper 
        sx={{ 
          p: 4,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: 2,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Grid container spacing={4}>
          {/* Columna de la foto */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120,
                  border: '4px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 0 20px rgba(241, 230, 254, 0.4)',
                }}
                src={userData?.photo || 'https://via.placeholder.com/150'}
              />
              <label htmlFor="upload-photo">
                <input
                  style={{ display: 'none' }}
                  id="upload-photo"
                  name="upload-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <IconButton
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#6366f1',
                    '&:hover': {
                      backgroundColor: '#4f46e5',
                    },
                  }}
                  disabled={uploading}
                >
                  {uploading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    <CameraAltIcon sx={{ color: 'white' }} />
                  )}
                </IconButton>
              </label>
            </Box>
            <Button
              variant="outlined"
              onClick={() => setOpenPasswordDialog(true)}
              sx={{
                mt: 2,
                borderColor: '#6366f1',
                color: '#6366f1',
                '&:hover': {
                  borderColor: '#4f46e5',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                }
              }}
            >
              Cambiar Contraseña
            </Button>
          </Grid>

          {/* Columna de la información */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={userData?.name || ''}
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={userData?.lastName || ''}
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Documento"
                  value={userData?.documentNamber || ''}
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="numberPhone"
                  value={isEditing ? editedData.numberPhone : userData?.numberPhone || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={isEditing ? editedData.email : userData?.email || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Secundario"
                  name="backupEmail"
                  value={isEditing ? editedData.backupEmail : userData?.backupEmail || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de Inicio"
                  value={userData?.startDate ? new Date(userData.startDate).toLocaleDateString() : ''}
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Rol"
                  value={userData?.role || ''}
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                    sx={{
                      backgroundColor: '#6366f1',
                      '&:hover': {
                        backgroundColor: '#4f46e5',
                      }
                    }}
                  >
                    Editar Perfil
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedData({
                          numberPhone: userData?.numberPhone || '',
                          email: userData?.email || '',
                          backupEmail: userData?.backupEmail || ''
                        });
                      }}
                      sx={{
                        color: '#6366f1',
                        borderColor: '#6366f1',
                        '&:hover': {
                          borderColor: '#4f46e5',
                          backgroundColor: 'rgba(99, 102, 241, 0.04)',
                        }
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      sx={{
                        backgroundColor: '#6366f1',
                        '&:hover': {
                          backgroundColor: '#4f46e5',
                        }
                      }}
                    >
                      Guardar Cambios
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Diálogo de cambio de contraseña */}
      <Dialog 
        open={openPasswordDialog} 
        onClose={() => setOpenPasswordDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            p: 2
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          color: '#6366f1',
          fontWeight: 'bold',
          pb: 3
        }}>
          Cambiar Contraseña
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="currentPassword"
            label="Contraseña Actual"
            type="password"
            fullWidth
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            error={!!passwordError}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#6366f1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6366f1',
                },
              },
            }}
          />
          <TextField
            margin="dense"
            name="newPassword"
            label="Nueva Contraseña"
            type="password"
            fullWidth
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            error={!!passwordError}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#6366f1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6366f1',
                },
              },
            }}
          />
          <TextField
            margin="dense"
            name="confirmPassword"
            label="Confirmar Nueva Contraseña"
            type="password"
            fullWidth
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            error={!!passwordError}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#6366f1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6366f1',
                },
              },
            }}
          />
          {passwordError && (
            <Typography 
              color="error" 
              variant="body2" 
              sx={{ 
                mt: 1,
                textAlign: 'center',
                fontSize: '0.875rem'
              }}
            >
              {passwordError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'center',
          p: 3,
          pt: 2
        }}>
          <Button 
            onClick={() => setOpenPasswordDialog(false)}
            sx={{
              color: '#6366f1',
              borderColor: '#6366f1',
              '&:hover': {
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(99, 102, 241, 0.04)',
              },
              px: 4
            }}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handlePasswordSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#6366f1',
              '&:hover': {
                backgroundColor: '#4f46e5',
              },
              px: 4
            }}
          >
            Cambiar Contraseña
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage; 