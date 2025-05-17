import { ReactNode } from 'react';
import keycloak from './lib/keycloak';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
