import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import PageBackground from '../components/PageBackground';
import { DATABASE_URL } from '../config/config';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Logout as LogoutIcon,
  CameraAlt as CameraAltIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
} from '@mui/icons-material';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const drawerWidth = 240;

const DashboardPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    avatar: 'https://via.placeholder.com/150'
  });
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openNotifications, setOpenNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    // Configurar la conexión con SignalR
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${DATABASE_URL}/notificationHub`, {
        accessTokenFactory: () => accessToken,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      if (connection) {
        connection.stop(); // Detén la conexión cuando el componente se desmonte
      }
    };
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log('Conexión SignalR establecida.');

          // Escucha eventos desde el backend
          connection.on('ReceiveNotification', (notification) => {
            setNotifications((prev) => [...prev, notification]);
          });

          // También puedes escuchar eventos para otras funcionalidades
          connection.on('NotificationRead', (notificationId) => {
            setNotifications((prev) =>
              prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
            );
          });
        })
        .catch((error) => console.error('Error al conectar con SignalR:', error));
    }
  }, [connection]);
  useEffect(() => {
    const idToken = localStorage.getItem('idToken');
    if (idToken) {
      try {
        const tokenPayload = JSON.parse(atob(idToken.split('.')[1]));
        setUserData({
          name: tokenPayload.Name || 'Usuario',
          email: tokenPayload.email || 'email@ejemplo.com',
          role: tokenPayload.isInternal === "True" ? 'Interno' : 'Externo',
          avatar: 'https://via.placeholder.com/150'
        });
      } catch (err) {
        console.error('Error al decodificar el token:', err);
      }
    }
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setSelectedImage(URL.createObjectURL(file));
        setUploading(true);

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No se encontró el token de acceso');
        }

        const base64File = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const response = await fetch(`${DATABASE_URL}/api/Collaborator/PutImage`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            file: base64File,
            fileName: file.name,
            contentType: file.type
          })
        });

        if (response.ok) {
          const imagePath = await response.text();
          setUserData(prev => ({
            ...prev,
            avatar: imagePath
          }));
        } else {
          const errorText = await response.text();
          const errorData = JSON.parse(errorText);
          throw new Error(`Error al subir la imagen: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        // Aquí podrías mostrar un mensaje de error al usuario
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    // Limpiar todos los datos de autenticación del localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    
    // Cualquier otro dato que necesites limpiar...
    
    // Redirigir al login
    navigate('/');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Perfil', icon: <PersonIcon />, path: '/dashboard/profile' },
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/dashboard/users' },
    { text: 'Organización', icon: <BusinessIcon />, path: '/dashboard/organization' },
  ];

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(241, 230, 254, 0.4), rgba(253, 230, 246, 0.4))',
      }}>
        <Box
          sx={{
            position: 'relative',
            cursor: 'pointer',
            '&:hover': {
              '& .MuiBox-root': {
                opacity: 1
              }
            }
          }}
          onClick={() => setOpenProfileModal(true)}
        >
          <Avatar
            sx={{ 
              width: 64, 
              height: 64, 
              mb: 1,
              border: '4px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 0 20px rgba(241, 230, 254, 0.4)',
            }}
            src={userData.avatar}
            alt={userData.name}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
              opacity: 0,
              transition: 'opacity 0.3s',
              color: 'white',
              fontSize: '12px'
            }}
          >
            Ver Perfil
          </Box>
        </Box>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #a78bfa, #f0abfc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {userData.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          {userData.email}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#a78bfa',
            backgroundColor: 'rgba(167, 139, 250, 0.1)',
            padding: '2px 8px',
            borderRadius: '12px',
            marginTop: '4px'
          }}
        >
          {userData.role}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(241, 230, 254, 0.4)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, rgba(241, 230, 254, 0.4), rgba(253, 230, 246, 0.4))',
                  borderRight: '3px solid #a78bfa',
                  '&:hover': {
                    background: 'linear-gradient(90deg, rgba(241, 230, 254, 0.6), rgba(253, 230, 246, 0.6))',
                  },
                },
                '&:hover': {
                  background: 'linear-gradient(90deg, rgba(241, 230, 254, 0.2), rgba(253, 230, 246, 0.2))',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#a78bfa' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  sx: {
                    color: location.pathname === item.path ? '#a78bfa' : '#666',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(241, 230, 254, 0.4)' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              '&:hover': {
                background: 'linear-gradient(90deg, rgba(254, 226, 226, 0.2), rgba(254, 226, 226, 0.4))',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#f9a8d4' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Cerrar Sesión"
              primaryTypographyProps={{
                sx: { color: '#f9a8d4' }
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }} className="min-h-screen bg-[#fefeff] relative overflow-hidden">
      <PageBackground />
      
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          color: '#666',
          boxShadow: '0 8px 32px 0 rgba(241, 230, 254, 0.2)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{
              flexGrow: 1,
              background: 'linear-gradient(to right, #a78bfa, #f0abfc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Dashboard
          </Typography>
          <IconButton color="inherit" onClick={() => setOpenNotifications(true)}>
            <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
              {notifications.filter(n => !n.read).length > 0 ? 
                <NotificationsActiveIcon sx={{ color: '#a78bfa' }} /> : 
                <NotificationsIcon sx={{ color: '#a78bfa' }} />}
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              borderRight: '1px solid rgba(241, 230, 254, 0.4)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              borderRight: '1px solid rgba(241, 230, 254, 0.4)',
              boxShadow: '4px 0 24px 0 rgba(241, 230, 254, 0.2)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {location.pathname === '/dashboard' ? (
          <Box>
            {/* Resumen */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>Tareas Pendientes</Typography>
                  <Typography variant="h3" sx={{ color: '#a78bfa' }}>12</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>En Progreso</Typography>
                  <Typography variant="h3" sx={{ color: '#f0abfc' }}>5</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>Completadas</Typography>
                  <Typography variant="h3" sx={{ color: '#86efac' }}>8</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Kanban simplificado */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 2,
                    minHeight: 400,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>Por Hacer</Typography>
                  {/* Aquí irían las tarjetas de tareas */}
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 2,
                    minHeight: 400,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>En Progreso</Typography>
                  {/* Aquí irían las tarjetas de tareas */}
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 2,
                    minHeight: 400,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>Completado</Typography>
                  {/* Aquí irían las tarjetas de tareas */}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Outlet />
        )}
      </Box>
      
      <Dialog
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        maxWidth="sm"
        fullWidth
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
          <Box sx={{ 
            background: 'linear-gradient(to right, #6366f1, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            Perfil de Usuario
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120,
                  border: '4px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 0 20px rgba(241, 230, 254, 0.4)',
                }}
                src={selectedImage || userData.avatar}
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
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#a855f7',
                    '&:hover': {
                      backgroundColor: '#9333ea',
                    },
                  }}
                  component="span"
                  disabled={uploading}
                >
                  {uploading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <CameraAltIcon sx={{ color: 'white' }} />
                  )}
                </IconButton>
              </label>
            </Box>
            
            <TextField
              fullWidth
              label="Nombre"
              value={userData.name}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={userData.email}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Rol"
              value={userData.role}
              disabled
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProfileModal(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openNotifications} onClose={() => setOpenNotifications(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Notificaciones
          </Typography>
        </DialogTitle>
        <DialogContent>
          {notifications.length > 0 ? (
            <List>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'rgba(241, 230, 254, 0.2)',
                    borderRadius: 1,
                    mb: 1,
                  }}
                  onClick={() => markNotificationAsRead(notification.id)} // Conecta con el endpoint si es necesario
                >
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.timestamp).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay notificaciones.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNotifications(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default DashboardPage; 