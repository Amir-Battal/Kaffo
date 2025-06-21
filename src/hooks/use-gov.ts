// hooks/useConcernedParties.ts
import keycloak from "@/lib/keycloak";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

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


export const useGovById = (id: number | null) => {
  const fetchMinistry = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/govs/${id}`, {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    });
    return response.data;
  };

  const {
    data: currentUser,
    isLoading,
    error,
    refetch,
  } = useQuery(["gov", id], fetchMinistry, {
    enabled: !!id,
  });

  if (error) {
    toast.error((error as Error).message);
  }

  return { currentUser, isLoading, refetch };
};


export const useAllParties = () => {
  return useQuery("parties", async () => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/govs`, {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    });
    // const parties = response.data.filter((gov) => gov.parentGovId );
    return response.data;
  });
};

export const useConcernedParties = (ministryId: number) => {
  return useQuery("concerned-parties", async () => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/govs`, {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    });
    const parties = response.data.filter((gov) => gov.parentGovId === ministryId);
    return parties;
  });
};



export type UpdateGovPayload = {
  id: number;
  name: string;
  email: string;
  phone: string;
  logoUrl?: string;
  addressId?: number;
  parentGovId?: number | null;
};


export const useUpdateGovInfo = () => {
  const updateGov = async (payload: UpdateGovPayload) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/govs/${payload.id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  return useMutation({
    mutationFn: updateGov,
    onSuccess: () => {
      toast.success("تم تعديل بيانات الجهة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء تعديل البيانات");
    },
  });
};






export type CreateGovPayload = {
  name: string;
  email: string;
  phone: string;
  logoUrl?: string;
  addressId: number;
  parentGovId?: number;
};

export const useCreateGov = () => {
  return useMutation({
    mutationFn: async (payload: CreateGovPayload) => {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/govs`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("تم إنشاء الجهة بنجاح!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء إنشاء الجهة.");
    },
  });
};
