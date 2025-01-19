import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { DATABASE_URL } from '../config/config';

const NewUserModal = ({ open, onClose, mode, selectedUser, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    documentNumber: '',
    documentType: 'DNI',
    numberPhone: '',
    startDate: null,
    endDate: null,
    email: '',
    backupEmail: '',
    collaboratorTypeId: '1',
    organizationId: '1',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && selectedUser) {
      setFormData({
        ...selectedUser,
        documentType: selectedUser.documentType || 'DNI',
        collaboratorTypeId: selectedUser.collaboratorTypeId?.toString() || '1',
        organizationId: selectedUser.organizationId?.toString() || '1',
      });
    } else {
      // Reset form para modo crear
      setFormData({
        name: '',
        lastName: '',
        documentNumber: '',
        documentType: 'DNI',
        numberPhone: '',
        startDate: null,
        endDate: null,
        collaboratorTypeId: '1',
        organizationId: '1',
      });
    }
  }, [mode, selectedUser, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (newValue, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${DATABASE_URL}/api/Collaborator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(formData)
      });

      // ... resto del código ...
    } catch (error) {
      // ... manejo de errores ...
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {mode === 'create' ? 'Nuevo Usuario' : 
         mode === 'edit' ? 'Editar Usuario' : 
         'Ver Usuario'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              name="name"
              label="Nombre"
              fullWidth
              disabled={mode === 'view'}
              value={mode === 'create' ? formData.name : selectedUser?.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="lastName"
              label="Apellido"
              fullWidth
              disabled={mode === 'view'}
              value={mode === 'create' ? formData.lastName : selectedUser?.lastName}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="documentType"
              select
              label="Tipo de Documento"
              fullWidth
              disabled={mode === 'view'}
              value={formData.documentType || 'DNI'}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="DNI">DNI</MenuItem>
              <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="documentNumber"
              label="Documento"
              fullWidth
              disabled={mode === 'view'}
              value={mode === 'create' ? formData.documentNumber : selectedUser?.documentNumber}
              onChange={handleInputChange}
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="numberPhone"
              label="Teléfono"
              fullWidth
              disabled={mode === 'view'}
              value={mode === 'create' ? formData.numberPhone : selectedUser?.numberPhone}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Fecha de inicio"
              disabled={mode === 'view'}
              value={mode === 'create' ? formData.startDate : selectedUser?.startDate ? dayjs(selectedUser.startDate) : null}
              onChange={(newValue) => handleDateChange(newValue, 'startDate')}
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  required: true 
                } 
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              disabled={mode === 'view'}
              value={mode === 'create' ? formData.email : selectedUser?.email}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="backupEmail"
              label="Email Secundario"
              type="email"
              fullWidth
              disabled={mode === 'view'}
              value={mode === 'create' ? formData.backupEmail : selectedUser?.backupEmail}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="collaboratorTypeId"
              select
              label="Rol"
              fullWidth
              disabled={mode === 'view'}
              value={formData.collaboratorTypeId || '1'}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="1">Interno</MenuItem>
              <MenuItem value="2">Externo</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="organizationId"
              select
              label="Compañía"
              fullWidth
              disabled={mode === 'view'}
              value={formData.organizationId || '1'}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="1">Empresa A</MenuItem>
              <MenuItem value="2">Empresa B</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        {mode !== 'view' && (
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NewUserModal; 