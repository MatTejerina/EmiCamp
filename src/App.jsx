import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import OrganizationPage from './pages/OrganizationPage';
import ProfilePage from './pages/ProfilePage';
import GoogleCallback from './components/GoogleCallback';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <GoogleOAuthProvider 
        clientId="933718834009-li38eolul7ktri67pao3m6b9j0guj9ro.apps.googleusercontent.com"
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/auth/callback" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />}>
              <Route index element={<ProfilePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="organization" element={<OrganizationPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </LocalizationProvider>
  );
}

export default App;