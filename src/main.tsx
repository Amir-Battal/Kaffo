import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "leaflet/dist/leaflet.css";
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import keycloak from './lib/keycloak';

import { QueryClient, QueryClientProvider } from 'react-query';


const queryClient = new QueryClient();


keycloak.init({ onLoad: "login-required" })
  .then((authenticated) => {
    if (authenticated) {
      localStorage.setItem("token", keycloak.token!);
      localStorage.setItem("refreshToken", keycloak.refreshToken!);

      createRoot(document.getElementById('root')!).render(
        <StrictMode>
          <Router>
            <QueryClientProvider client={queryClient}>
              <AppRoutes />
            </QueryClientProvider>
          </Router>
        </StrictMode>,
      );
    } else {
      console.log('login failed');
      keycloak.login();
    }
  })
  .catch((err) => {
    console.error("❌ Keycloak init failed:", err);
  });

