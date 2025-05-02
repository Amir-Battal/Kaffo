import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "leaflet/dist/leaflet.css";
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import keycloak from './lib/keycloack';

keycloak.init({ onLoad: "login-required" }).then((authenticated) => {
  if (authenticated) {
    // ✅ حفظ التوكن في localStorage
    localStorage.setItem("token", keycloak.token!);

    // (اختياري) حفظ الـ refresh token
    localStorage.setItem("refreshToken", keycloak.refreshToken!);

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <Router>
          <AppRoutes />
        </Router>
      </StrictMode>,
    )
  }else{
    keycloak.login();
  }
});
