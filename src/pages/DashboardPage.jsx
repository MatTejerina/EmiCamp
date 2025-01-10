import { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const DashboardPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const menuItems = [
    { text: 'Perfil', icon: <PersonIcon />, path: '/profile' },
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/users' },
    { text: 'Organización', icon: <BusinessIcon />, path: '/organization' },
  ];

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
      }}>
        <Avatar
          sx={{ 
            width: 64, 
            height: 64, 
            mb: 1,
            border: '4px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
          }}
          src="https://via.placeholder.com/150"
        />
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #6366f1, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Usuario Ejemplo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          usuario@ejemplo.com
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(99, 102, 241, 0.1)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                  borderRight: '3px solid #6366f1',
                  '&:hover': {
                    background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
                  },
                },
                '&:hover': {
                  background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#6366f1' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  sx: {
                    color: location.pathname === item.path ? '#6366f1' : 'inherit',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(99, 102, 241, 0.1)' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              '&:hover': {
                background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.1))',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#ef4444' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Cerrar Sesión"
              primaryTypographyProps={{
                sx: { color: '#ef4444' }
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f0f2f5' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          color: 'text.primary',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
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
              background: 'linear-gradient(to right, #6366f1, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Dashboard
          </Typography>
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
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              borderRight: '1px solid rgba(99, 102, 241, 0.1)',
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
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              borderRight: '1px solid rgba(99, 102, 241, 0.1)',
              boxShadow: '4px 0 24px 0 rgba(31, 38, 135, 0.15)',
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
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top left, rgba(99, 102, 241, 0.15), transparent 30%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.15), transparent 30%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardPage; 