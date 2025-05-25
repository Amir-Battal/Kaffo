// hooks/useConcernedParties.ts
import keycloak from "@/lib/keycloak";
import axios from "axios";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const useAllMinistries = () => {
  return useQuery("govs", async () => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/govs`, {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    });
    const ministtries = response.data.filter((gov) => gov.parentGovId === null);
    return ministtries;
  });
};


export const useMinistryById = (id: number | null) => {
  return useQuery(
    ["gov", id],
    async () => {
      const response = await axios.get(`${API_BASE_URL}/api/v1/govs/${id}`, {
        headers: { Authorization: `Bearer ${keycloak.token}` },
      });
      return response.data;
    },
    {
      enabled: !!id, // لا يتم تنفيذ الطلب إذا لم يكن هناك id
    }
  );
};
