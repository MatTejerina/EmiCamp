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
  CircularProgress,
  Tooltip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Block as BlockIcon, 
  LockOpen as LockOpenIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PageBackground from '../components/PageBackground';
import NewUserModal from '../components/NewUserModal';
import dayjs from 'dayjs';
import { DATABASE_URL } from '../config/config';
import { commonStyles } from '../styles/commonStyles';

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
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        throw new Error('No se encontró el token de acceso');
      }

      const response = await fetch(`${DATABASE_URL}/api/Collaborator/GetAll`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setError(error.message);
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
    return (
      <Chip 
        label={statusConfig[status]?.label || 'Desconocido'} 
        color={statusConfig[status]?.color || 'default'}
        size="small"
      />
    );
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

  const handleCreate = () => {
    handleOpenDialog('create');
  };

  const handleView = (user) => {
    handleOpenDialog('view', user);
  };

  const handleEdit = (user) => {
    handleOpenDialog('edit', user);
  };

  const handleDelete = (id) => {
    handleDeleteUser({ id });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={commonStyles.pageContainer}>
      <PageBackground />
      
      <Typography 
        variant="h4" 
        component="h1"
        sx={commonStyles.pageTitle}
      >
        Gestión de Usuarios
      </Typography>

      <Button
        variant="contained"
        onClick={handleCreate}
        startIcon={<AddIcon />}
        sx={commonStyles.actionButton}
      >
        Nuevo Usuario
      </Button>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2, borderRadius: '8px' }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      <TableContainer 
        component={Paper} 
        sx={commonStyles.tableContainer}
      >
        <Table sx={commonStyles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Nombre y Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Compañía</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.name} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.numberPhone}</TableCell>
                <TableCell>{user.organization?.name}Saraza</TableCell> 
                <TableCell>{getStatusChip(user.state)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Ver detalles">
                    <IconButton 
                      size="small"
                      onClick={() => handleView(user)}
                      sx={commonStyles.actionIcons.view}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar usuario">
                    <IconButton 
                      size="small"
                      onClick={() => handleEdit(user)}
                      sx={commonStyles.actionIcons.edit}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar usuario">
                    <IconButton 
                      size="small"
                      onClick={() => handleDelete(user.id)}
                      sx={commonStyles.actionIcons.delete}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <NewUserModal
        open={openModal}
        onClose={() => setOpenModal(false)}
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