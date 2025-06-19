import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "leaflet/dist/leaflet.css";
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import keycloak from './lib/keycloak';

import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';


const queryClient = new QueryClient();


keycloak.init({
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
}).then((authenticated) => {
  if (authenticated) {
    localStorage.setItem("token", keycloak.token!);
    localStorage.setItem("refreshToken", keycloak.refreshToken!);
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Router>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <AppRoutes />
        </QueryClientProvider>
      </Router>
    </StrictMode>,
  );
}).catch((err) => {
  console.error("❌ Keycloak init failed:", err);
});


