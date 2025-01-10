import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import OrganizationPage from './pages/OrganizationPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/" element={<DashboardPage />}>
          <Route path="/dashboard" element={<h1>Bienvenido al Dashboard</h1>} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/organization" element={<OrganizationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;