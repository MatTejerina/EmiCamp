import { useState } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ProfilePage = () => {
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  
  const user = {
    name: 'Usuario Ejemplo',
    email: 'usuario@ejemplo.com',
    role: 'Admin',
    avatar: 'https://via.placeholder.com/150',
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Imagen seleccionada:', file);
    }
  };

  return (
    <Box>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(to right, #6366f1, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}
      >
        Mi Perfil
      </Typography>

      <Paper 
        sx={{ 
          p: 3,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: 2,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={user.avatar}
                sx={{ 
                  width: 150, 
                  height: 150, 
                  mb: 2,
                  border: '4px solid rgba(99, 102, 241, 0.2)',
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <input
                  accept="image/*"
                  type="file"
                  id="icon-button-file"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="icon-button-file">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<PhotoCameraIcon />}
                    sx={{
                      background: 'linear-gradient(to right, #6366f1, #a855f7)',
                      '&:hover': {
                        background: 'linear-gradient(to right, #4f46e5, #9333ea)',
                      }
                    }}
                  >
                    Cambiar
                  </Button>
                </label>
                <IconButton 
                  sx={{ 
                    color: '#ef4444',
                    '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                background: 'linear-gradient(to right, #6366f1, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}
            >
              Información Personal
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre"
                  defaultValue={user.name}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(99, 102, 241, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(99, 102, 241, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue={user.email}
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(99, 102, 241, 0.2)',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rol"
                  defaultValue={user.role}
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(99, 102, 241, 0.2)',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenPasswordDialog(true)}
                  sx={{
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
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Dialog 
        open={openPasswordDialog} 
        onClose={() => setOpenPasswordDialog(false)}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: 2,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }
        }}
      >
        <DialogTitle>
          <Typography 
            variant="h5"
            sx={{ 
              background: 'linear-gradient(to right, #6366f1, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Cambiar Contraseña
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Contraseña Actual"
              type="password"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                  },
                },
              }}
            />
            <TextField
              label="Nueva Contraseña"
              type="password"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                  },
                },
              }}
            />
            <TextField
              label="Confirmar Nueva Contraseña"
              type="password"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenPasswordDialog(false)}
            sx={{ color: '#6366f1' }}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained"
            sx={{
              background: 'linear-gradient(to right, #6366f1, #a855f7)',
              '&:hover': {
                background: 'linear-gradient(to right, #4f46e5, #9333ea)',
              }
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage; 