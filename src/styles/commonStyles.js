export const commonStyles = {
  pageContainer: {
    position: 'relative',
    padding: '24px'
  },
  pageTitle: {
    marginBottom: '32px',
    background: 'linear-gradient(to right, #9333ea, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold'
  },
  actionButton: {
    marginBottom: '24px',
    background: 'linear-gradient(to right, #9333ea, #ec4899)',
    '&:hover': {
      background: 'linear-gradient(to right, #7e22ce, #db2777)',
    }
  },
  tableContainer: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    borderRadius: '8px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  actionIcons: {
    view: { color: '#10b981' },    // Verde
    edit: { color: '#6366f1' },    // Azul
    delete: { color: '#ef4444' }   // Rojo
  },
  dialog: {
    paper: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      borderRadius: '12px',
    }
  },
  formContainer: {
    paddingTop: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  }
}; 