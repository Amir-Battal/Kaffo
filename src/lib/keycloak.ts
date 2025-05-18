// src/keycloak.js
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:9098",
  realm: "kafu-realm",
  clientId: "react-client"  	
});

export default keycloak;
