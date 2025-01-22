import { useState, useEffect } from 'react';
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
  Typography,
  Tooltip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PageBackground from '../components/PageBackground';
import { commonStyles } from '../styles/commonStyles';

const OrganizationPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [organizations, setOrganizations] = useState([
    {
      id: 1,
      name: 'Empresa Ejemplo S.A.',
      email: 'contacto@empresa-ejemplo.com',
      phoneNumber: '11-4444-5555',
      description: 'Empresa líder en soluciones tecnológicas',
      cuit: '30-12345678-9',
      address: 'Av. Siempreviva 742',
      creationDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Corporación Tecnológica',
      email: 'info@corptec.com',
      phoneNumber: '11-2222-3333',
      description: 'Desarrollo de software y consultoría IT',
      cuit: '30-98765432-1',
      address: 'Calle Falsa 123',
      creationDate: '2023-03-20'
    },
    {
      id: 3,
      name: 'Innovaciones Digitales',
      email: 'contacto@innova-digital.com',
      phoneNumber: '11-6666-7777',
      description: 'Servicios de transformación digital',
      cuit: '30-45678901-2',
      address: 'Av. Tecnología 567',
      creationDate: '2023-06-10'
    }
  ]);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    description: '',
    cuit: '',
    address: '',
    creationDate: dayjs()
  });

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedOrg(null);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      description: '',
      cuit: '',
      address: '',
      creationDate: dayjs()
    });
    setOpenDialog(true);
  };

  const handleEdit = (org) => {
    setDialogMode('edit');
    setSelectedOrg(org);
    setFormData({
      ...org,
      creationDate: dayjs(org.creationDate)
    });
    setOpenDialog(true);
  };

  const handleView = (org) => {
    setDialogMode('view');
    setSelectedOrg(org);
    setFormData({
      ...org,
      creationDate: dayjs(org.creationDate)
    });
    setOpenViewDialog(true);
  };

  const handleDelete = async (orgId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta organización?')) {
      // Simular eliminación
      const filteredOrgs = organizations.filter(org => org.id !== orgId);
      setOrganizations(filteredOrgs);
    }
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        // Simular creación
        const newOrg = {
          id: organizations.length + 1,
          ...formData,
          creationDate: formData.creationDate.format('YYYY-MM-DD')
        };
        setOrganizations([...organizations, newOrg]);
      } else if (dialogMode === 'edit') {
        // Simular edición
        const updatedOrgs = organizations.map(org => 
          org.id === selectedOrg.id 
            ? { 
                ...formData, 
                id: org.id,
                creationDate: formData.creationDate.format('YYYY-MM-DD')
              }
            : org
        );
        setOrganizations(updatedOrgs);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box sx={commonStyles.pageContainer}>
      <PageBackground />
      <Typography variant="h4" sx={commonStyles.pageTitle}>
        Gestión de Organizaciones
      </Typography>

      <Button 
        variant="contained" 
        onClick={handleCreate}
        sx={commonStyles.actionButton}
      >
        Nueva Organización
      </Button>

      <TableContainer 
        component={Paper}
        sx={commonStyles.tableContainer}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>CUIT</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell>{org.name}</TableCell>
                <TableCell>{org.email}</TableCell>
                <TableCell>{org.phoneNumber}</TableCell>
                <TableCell>{org.cuit}</TableCell>
                <TableCell>
                  <Tooltip title="Ver">
                    <IconButton onClick={() => handleView(org)} sx={commonStyles.actionIcons.view}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleEdit(org)} sx={commonStyles.actionIcons.edit}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(org.id)} sx={commonStyles.actionIcons.delete}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de Creación/Edición */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: commonStyles.dialog.paper
        }}
      >
        <DialogTitle>
          {dialogMode === 'create' ? 'Nueva Organización' : 'Editar Organización'}
        </DialogTitle>
        <DialogContent>
          <Box sx={commonStyles.formContainer}>
            <TextField 
              label="Nombre" 
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <TextField 
              label="Email" 
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <TextField 
              label="Teléfono" 
              fullWidth
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            />
            <TextField 
              label="CUIT" 
              fullWidth
              value={formData.cuit}
              onChange={(e) => setFormData({...formData, cuit: e.target.value})}
            />
            <TextField 
              label="Dirección" 
              fullWidth
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
            <TextField 
              label="Descripción" 
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Creación"
                value={formData.creationDate}
                onChange={(newValue) => setFormData({...formData, creationDate: newValue})}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Visualización */}
      <Dialog 
        open={openViewDialog} 
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: commonStyles.dialog.paper
        }}
      >
        <DialogTitle>Detalles de la Organización</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography><strong>Nombre:</strong> {formData.name}</Typography>
            <Typography><strong>Email:</strong> {formData.email}</Typography>
            <Typography><strong>Teléfono:</strong> {formData.phoneNumber}</Typography>
            <Typography><strong>CUIT:</strong> {formData.cuit}</Typography>
            <Typography><strong>Dirección:</strong> {formData.address}</Typography>
            <Typography><strong>Descripción:</strong> {formData.description}</Typography>
            <Typography>
              <strong>Fecha de Creación:</strong> {
                formData.creationDate ? dayjs(formData.creationDate).format('DD/MM/YYYY') : ''
              }
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrganizationPage; 