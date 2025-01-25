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
import LockIcon from '@mui/icons-material/Lock';
import { commonStyles } from '../styles/commonStyles';
import ChangePasswordModal from '../components/ChangePasswordModal';


const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState('');
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
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const idToken = localStorage.getItem('idToken');
        
        if (!accessToken || !idToken) {
          throw new Error('No se encontraron los tokens de autenticación');
        }

        // Obtener rol del accessToken
        const accessTokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
        const role = accessTokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setUserRole(role);

        // Obtener ID del usuario del idToken
        const idTokenPayload = JSON.parse(atob(idToken.split('.')[1]));
        const userId = idTokenPayload.idUser;

        const response = await fetch(`${DATABASE_URL}/api/Collaborator/${userId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos del perfil');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
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


  const handlePasswordChange = async ({ email, currentPassword, newPassword }) => {
    try {
      const response = await fetch(`${DATABASE_URL}/api/User/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ email, currentPassword , newPassword }),
      });
  
      if (response.ok) {
        setShowChangePasswordModal(false); // Cierra el modal
      } else {
        const errorData = await response.json();
        console.error('Error al cambiar contraseña:', errorData.message);
      }
    } catch (err) {
      console.error('Error al conectar con el servidor:', err);
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
      const idToken = localStorage.getItem('idToken');
      
      if (!accessToken || !idToken) {
        throw new Error('No se encontraron los tokens de autenticación');
      }

      // Obtener ID del usuario del idToken
      const tokenPayload = JSON.parse(atob(idToken.split('.')[1]));
      const userId = tokenPayload.idUser;

      // Crear objeto con los datos actualizados
      const updatedData = {
        id: userData.id,
        name: userData.name,
        lastName: userData.lastName,
        documentNumber: userData.documentNumber || userData.documentNamber, // Manejar ambos nombres de campo
        documentType: userData.documentType,
        numberPhone: editedData.numberPhone,
        email: editedData.email,
        backupEmail: editedData.backupEmail,
        photo: userData.photo,
        startDate: userData.startDate,
        endDate: userData.endDate,
        state: userData.state,
        collaboratorTypeId: userData.collaboratorTypeId,
        organizationId: userData.organizationId,
        roleId: userData.roleId || userData.role?.id, // Enviar solo el ID del rol
        userId: userData.userId
      };


      const response = await fetch(`${DATABASE_URL}/api/Collaborator/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Response:', errorText);
        throw new Error(`Error al actualizar el perfil. Status: ${response.status}`);
      }

      // Actualizar el estado local con los nuevos datos
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
        formData.append('file', file);
        formData.append('fileName', file.name);

        // Subir la imagen
        const response = await fetch(`${DATABASE_URL}/api/Collaborator/upload-photo/${userData.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Error al subir la imagen');
        }

        const imageUrl = await response.text();
        
        // Actualizar el estado local con la nueva URL de la imagen
        setUserData(prev => ({
          ...prev,
          photo: imageUrl
        }));

        setSnackbarMessage('Imagen de perfil actualizada exitosamente');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error:', error);
        setSnackbarMessage('Error al actualizar la imagen de perfil');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!userData) return <Alert severity="info">No se encontraron datos del usuario</Alert>;

  return (
    <Box sx={commonStyles.pageContainer}>
      <PageBackground />
      <Typography variant="h4" sx={commonStyles.pageTitle}>
        Mi Perfil
      </Typography>

      <Paper sx={{
        ...commonStyles.tableContainer,
        padding: 4,
        marginTop: 2
      }}>
        <Grid container spacing={4}>
          {/* Columna de la foto */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 2,
              position: 'relative'
            }}>
              <Box sx={{ 
                position: 'relative',
                width: 200,
                height: 200,
                marginBottom: 2
              }}>
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: 3,
                  border: '4px solid white',
                  position: 'relative'
                }}>
                  <Avatar
                    src={userData?.photo || '/default-avatar.png'}
                    alt={`${userData?.name} ${userData?.lastName}`}
                    sx={{ 
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </Box>
                <label htmlFor="upload-photo">
                  <input
                    style={{ display: 'none' }}
                    id="upload-photo"
                    name="upload-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      boxShadow: 2,
                      width: 40,
                      height: 40,
                      transform: 'translate(20%, 20%)',
                      zIndex: 1
                    }}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <CameraAltIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </label>
              </Box>
              <Typography variant="h5" sx={{ textAlign: 'center' }}>
                {userData?.name} {userData?.lastName}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center' }}>
                {userData?.email}
              </Typography>
              <Button
                variant="contained"
                onClick={() => setShowChangePasswordModal(true)}
                startIcon={<LockIcon />}
                sx={commonStyles.actionButton}
            >
                Cambiar Contraseña
            </Button>
            </Box>
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
                  value={userData?.documentNumber || ''}
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
                  value={userRole}
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
      <ChangePasswordModal
        show={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onPasswordChange={handlePasswordChange}
        isGenericPassword={false}
      />


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