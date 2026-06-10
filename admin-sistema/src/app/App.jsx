import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore.js';
import { AppRoutes } from './routes/AppRoutes.jsx';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
