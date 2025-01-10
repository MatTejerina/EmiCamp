import { useState } from 'react';
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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material';
import { Edit as EditIcon, Block as BlockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';

const UsersPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const roles = ['Admin', 'Editor', 'Viewer'];
  const users = [
    { id: 1, name: 'Usuario 1', email: 'usuario1@ejemplo.com', roles: ['Admin'], status: 'active' },
    { id: 2, name: 'Usuario 2', email: 'usuario2@ejemplo.com', roles: ['Editor'], status: 'inactive' },
  ];

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
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
        Gestión de Usuarios
      </Typography>

      <Button 
        variant="contained" 
        onClick={() => handleEdit(null)} 
        sx={{ 
          mb: 3,
          background: 'linear-gradient(to right, #6366f1, #a855f7)',
          '&:hover': {
            background: 'linear-gradient(to right, #4f46e5, #9333ea)',
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
              <TableCell>Roles</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roles.join(', ')}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: '50px',
                      display: 'inline-block',
                      bgcolor: user.status === 'active' ? 'rgba(99, 255, 132, 0.2)' : 'rgba(255, 99, 132, 0.2)',
                      color: user.status === 'active' ? 'success.main' : 'error.main',
                    }}
                  >
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleEdit(user)}
                    sx={{ color: '#6366f1' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton sx={{ color: '#ef4444' }}>
                    <BlockIcon />
                  </IconButton>
                  <IconButton sx={{ color: '#10b981' }}>
                    <LockOpenIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
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
            {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="Nombre" 
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
              label="Email" 
              type="email" 
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
            <FormGroup>
              {roles.map((role) => (
                <FormControlLabel
                  key={role}
                  control={
                    <Checkbox 
                      sx={{
                        color: '#6366f1',
                        '&.Mui-checked': {
                          color: '#6366f1',
                        },
                      }}
                    />
                  }
                  label={role}
                />
              ))}
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)}
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

export default UsersPage; 