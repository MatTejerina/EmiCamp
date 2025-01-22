import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { DATABASE_URL } from '../config/config';

const NewUserModal = ({ open, onClose, mode, selectedUser, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([
    { id: 1, name: 'Organización Por Defecto' } // Valor temporal mientras no hay endpoint
  ]);
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
    organizationId: '1', // Valor por defecto
    roleId: '1' // Establecemos un valor por defecto
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && selectedUser) {
      // Fetch del usuario específico para edición
      const fetchUserDetails = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          const response = await fetch(`${DATABASE_URL}/api/Collaborator/${selectedUser.id}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`Error al obtener detalles del usuario: ${response.status}`);
          }

          const userData = await response.json();
          setFormData({
            ...userData,
            documentType: userData.documentType || 'DNI',
            collaboratorTypeId: userData.collaboratorTypeId?.toString() || '1',
            organizationId: userData.organizationId?.toString() || '1',
            roleId: userData.roleId?.toString() || '1',
            startDate: userData.startDate ? dayjs(userData.startDate) : null,
            endDate: userData.endDate ? dayjs(userData.endDate) : null
          });
        } catch (error) {
          console.error('Error al obtener detalles del usuario:', error);
          setError(error.message);
        }
      };

      fetchUserDetails();
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
        email: '',
        backupEmail: '',
        collaboratorTypeId: '1',
        organizationId: '1',
        roleId: '1'
      });
    }
  }, [mode, selectedUser, open]);

  // Cargar roles y compañías al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      if (!open) return;
      
      try {
        const accessToken = localStorage.getItem('accessToken');
        
        // Solo fetch de roles por ahora
        const rolesResponse = await fetch(`${DATABASE_URL}/api/Collaborator/GetRoles`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        });

        if (!rolesResponse.ok) {
          throw new Error(`Error al obtener roles: ${rolesResponse.status}`);
        }

        const rolesData = await rolesResponse.json();
        setRoles(rolesData);

      } catch (error) {
        console.error('Error detallado:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, [open]);

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      
      // Preparar datos para enviar
      const dataToSend = {
        id: mode === 'edit' ? selectedUser.id : 0,
        name: formData.name,
        lastName: formData.lastName,
        documentNumber: formData.documentNumber,
        documentType: formData.documentType,
        numberPhone: formData.numberPhone,
        email: formData.email,
        backupEmail: formData.backupEmail,
        collaboratorTypeId: parseInt(formData.collaboratorTypeId),
        organizationId: parseInt(formData.organizationId),
        roleId: parseInt(formData.roleId),
        startDate: formData.startDate ? dayjs(formData.startDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ') : null,
        endDate: formData.endDate ? dayjs(formData.endDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ') : null
      };

      const url = mode === 'edit' 
        ? `${DATABASE_URL}/api/Collaborator/${selectedUser.id}`
        : `${DATABASE_URL}/api/Collaborator`;
      
      const method = mode === 'edit' ? 'PUT' : 'POST';

      console.log('Enviando datos:', dataToSend); // Para debugging

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error al ${mode === 'edit' ? 'actualizar' : 'crear'} usuario: ${response.status}. ${errorData}`);
      }

      onClose();
      if (onSubmit) {
        await onSubmit();
      }
    } catch (error) {
      console.error('Error detallado:', error);
      setError(error.message);
    } finally {
      setLoading(false);
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
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
              value={formData.startDate ? dayjs(formData.startDate) : null}
              onChange={(date) => handleDateChange(date, 'startDate')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !formData.startDate && Boolean(error)
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
              select
              fullWidth
              label="Compañía"
              name="organizationId"
              value={formData.organizationId}
              onChange={handleInputChange}
              required
              error={!formData.organizationId && Boolean(error)}
            >
              {companies.length > 0 ? (
                companies.map((company) => (
                  <MenuItem key={company.id} value={company.id.toString()}>
                    {company.name}
                    {company.descripcion && ` - ${company.descripcion}`}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No hay compañías disponibles</MenuItem>
              )}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Rol"
              name="roleId"
              value={formData.roleId}
              onChange={handleInputChange}
              required
              error={!formData.roleId && Boolean(error)}
            >
              {roles.length > 0 ? (
                roles.map((role) => (
                  <MenuItem key={role.id} value={role.id.toString()}>
                    {role.description}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No hay roles disponibles</MenuItem>
              )}
            </TextField>
          </Grid>
        </Grid>
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
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NewUserModal; 