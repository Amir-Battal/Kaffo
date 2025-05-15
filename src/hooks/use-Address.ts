// hooks/useAddress.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "sonner";
import keycloak from "@/lib/keycloak";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Address = {
  id?: number;
  latitude?: number;
  longitude?: number;
  description: string;
  city: string; // اسم المدينة (enum key)
};

type CityOption = {
  arabic: string;
  english: string;
  value: string;
};

// جلب جميع العناوين (مع إمكانية التصفّح)
export const useAddresses = (page: number = 0, size: number = 10) => {
  return useQuery(["addresses", page, size], async () => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/addresses`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
    return response.data;
  });
};

// جلب عنوان واحد عبر ID
export const useAddress = (id: number, options = {}) => {
  return useQuery(
    ["address", id],
    async () => {
      const response = await axios.get(`${API_BASE_URL}/api/v1/addresses/${id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
      return response.data;
    },
    {
      enabled: !!id, // ✅ تنفيذ الاستعلام فقط إذا كان id موجود
      ...options,
    }
  );
};


// إنشاء عنوان جديد
export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (address: Address) => {
      const response = await axios.post(`${API_BASE_URL}/api/v1/addresses`, address, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success("تم إنشاء العنوان بنجاح!");
        queryClient.invalidateQueries("addresses");
      },
      onError: (error: any) => {
        toast.error(error.message || "حدث خطأ أثناء إنشاء العنوان.");
      },
    }
  );
};

// تعديل عنوان
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (address: Address) => {
      const response = await axios.put(`${API_BASE_URL}/api/v1/addresses/${address.id}`, address, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success("تم تحديث العنوان بنجاح!");
        queryClient.invalidateQueries("addresses");
      },
      onError: (error: any) => {
        toast.error(error.message || "حدث خطأ أثناء تحديث العنوان.");
      },
    }
  );
};

// حذف عنوان
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: number) => {
      await axios.delete(`${API_BASE_URL}/api/v1/addresses/${id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
    },
    {
      onSuccess: () => {
        toast.success("تم حذف العنوان بنجاح!");
        queryClient.invalidateQueries("addresses");
      },
      onError: (error: any) => {
        toast.error(error.message || "حدث خطأ أثناء حذف العنوان.");
      },
    }
  );
};

// جلب المدن
export const useCities = () => {
  return useQuery("cities", async (): Promise<CityOption[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/addresses/cities`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
    return response.data;
  });
};
