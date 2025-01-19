import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Chip,
  Alert,
  DialogContentText,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Block as BlockIcon, 
  LockOpen as LockOpenIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PageBackground from '../components/PageBackground';
import NewUserModal from '../components/NewUserModal';
import dayjs from 'dayjs';
import { DATABASE_URL } from '../config/config';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedUser, setSelectedUser] = useState(null);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    documentNamber: '',
    documentType: 'DNI',
    numberPhone: '',
    startDate: null,
    endDate: null,
    email: '',
    backupEmail: '',
    collaboratorTypeId: 1,
    organizationId: 1
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        throw new Error('No se encontró el token de acceso');
      }

      const response = await fetch(`${DATABASE_URL}/api/Collaborator/29`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener el usuario');
      }

      const user = await response.json();
      console.log('Usuario obtenido:', user);
      
      setUsers([user]);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = (mode, user = null) => {
    setDialogMode(mode);
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      1: { label: 'Activo', color: 'success' },
      2: { label: 'Inactivo', color: 'error' },
      3: { label: 'Bloqueado', color: 'warning' }
    };
    const config = statusConfig[status] || statusConfig[2];
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  // Funciones para manejar acciones
  const handleBlockUser = (user) => {
    setSelectedUser(user);
    setOpenBlockDialog(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handlePasswordChange = (user) => {
    setSelectedUser(user);
    setOpenPasswordDialog(true);
  };

  const handleConfirmBlock = () => {
    // Aquí iría la lógica para bloquear/desbloquear
    setSnackbar({
      open: true,
      message: `Usuario ${selectedUser.state === 1 ? 'bloqueado' : 'desbloqueado'} exitosamente`,
      severity: 'success'
    });
    setOpenBlockDialog(false);
  };

  const handleConfirmDelete = () => {
    // Aquí iría la lógica para eliminar
    setSnackbar({
      open: true,
      message: 'Usuario eliminado exitosamente',
      severity: 'success'
    });
    setOpenDeleteDialog(false);
  };

  const handleConfirmPasswordChange = () => {
    // Aquí iría la lógica para cambiar la contraseña
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Las contraseñas no coinciden',
        severity: 'error'
      });
      return;
    }
    setSnackbar({
      open: true,
      message: 'Contraseña actualizada exitosamente',
      severity: 'success'
    });
    setOpenPasswordDialog(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date ? dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSSZ') : null
    }));
  };

  const handleSubmit = async (formData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No se encontró el token de acceso');
      }

      const response = await fetch(`${DATABASE_URL}/api/Collaborator`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el usuario');
      }

      setSnackbar({
        open: true,
        message: 'Usuario creado exitosamente',
        severity: 'success'
      });

      fetchUsers(); // Actualizar la lista después de crear
      handleCloseDialog();
    } catch (err) {
      throw new Error(err.message || 'Error al crear el usuario');
    }
  };

  return (
    <Box className="relative">
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
        Gestión de Usuarios
      </Typography>

      <Button 
        variant="contained" 
        onClick={() => handleOpenDialog('create')}
        sx={{ 
          mb: 3,
          background: 'linear-gradient(to right, #9333ea, #ec4899)',
          '&:hover': {
            background: 'linear-gradient(to right, #7e22ce, #db2777)',
          }
        }}
      >
        Nuevo Usuario
      </Button>

      <TableContainer 
        component={Paper}
        sx={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: 2,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{`${user.name} ${user.lastName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.numberPhone}</TableCell>
                  <TableCell>{`${user.documentType} ${user.documentNamber}`}</TableCell>
                  <TableCell>{dayjs(user.startDate).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>{getStatusChip(user.state)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog('view', user)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDialog('edit', user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      sx={{ color: user.state === 1 ? '#ef4444' : '#10b981' }}
                    >
                      {user.state === 1 ? <BlockIcon /> : <LockOpenIcon />}
                    </IconButton>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <NewUserModal
        open={openDialog}
        onClose={handleCloseDialog}
        mode={dialogMode}
        selectedUser={selectedUser}
        onSubmit={handleSubmit}
      />

      {/* Modal de Bloquear/Desbloquear */}
      <Dialog open={openBlockDialog} onClose={() => setOpenBlockDialog(false)}>
        <DialogTitle>
          {selectedUser?.state === 1 ? 'Bloquear Usuario' : 'Desbloquear Usuario'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea {selectedUser?.state === 1 ? 'bloquear' : 'desbloquear'} a este usuario?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBlockDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmBlock} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Eliminar */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Eliminar Usuario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar a este usuario? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Cambiar Contraseña */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Contraseña Actual"
                type="password"
                fullWidth
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nueva Contraseña"
                type="password"
                fullWidth
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirmar Nueva Contraseña"
                type="password"
                fullWidth
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmPasswordChange} variant="contained" color="primary">
            Cambiar Contraseña
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersPage; 