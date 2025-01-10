import { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const OrganizationPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const organizations = [
    { id: 1, name: 'Organización 1', description: 'Descripción 1', address: 'Dirección 1' },
    { id: 2, name: 'Organización 2', description: 'Descripción 2', address: 'Dirección 2' },
  ];

  const handleEdit = (org) => {
    setSelectedOrg(org);
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
        Gestión de Organizaciones
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
        Nueva Organización
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
              <TableCell>Descripción</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell>{org.name}</TableCell>
                <TableCell>{org.description}</TableCell>
                <TableCell>{org.address}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleEdit(org)}
                    sx={{ color: '#6366f1' }}
                  >
                    <EditIcon />
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
          <Typography 
            variant="h5"
            sx={{ 
              background: 'linear-gradient(to right, #6366f1, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            {selectedOrg ? 'Editar Organización' : 'Nueva Organización'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="Nombre" 
              fullWidth 
              defaultValue={selectedOrg?.name}
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
              label="Descripción" 
              fullWidth 
              multiline 
              rows={3}
              defaultValue={selectedOrg?.description}
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
              label="Dirección" 
              fullWidth
              defaultValue={selectedOrg?.address}
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

export default OrganizationPage; 