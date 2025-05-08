// hooks/use-category.ts
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "sonner";
import keycloak from "@/lib/keycloack";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Category = {
  id?: number;
  name: string;
  govId: number;
};

// إنشاء صنف جديد
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (category: Category) => {
      const response = await axios.post(`${API_BASE_URL}/api/v1/problem-categories`, category, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success("تم إنشاء الصنف بنجاح!");
        queryClient.invalidateQueries("categories");
      },
      onError: (error: any) => {
        toast.error(error.message || "حدث خطأ أثناء إنشاء الصنف.");
      },
    }
  );
};

// جلب صنف عبر ID
export const useCategory = (id: number, options = {}) => {
  return useQuery(
    ["category", id],
    async () => {
      const response = await axios.get(`${API_BASE_URL}/api/v1/problem-categories/${id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
      return response.data;
    },
    {
      enabled: !!id,
      ...options,
    }
  );
};

// جلب جميع التصنيفات حسب معرف المحافظة
export const useCategoriesByGovId = (govId: number) => {
  return useQuery(
    ["categories", govId],
    async () => {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/problem-categories/by-gov/${govId}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!govId, // فقط عندما يكون govId موجود
    }
  );
};


// useAllCategories
export const useAllCategories = () => {
  return useQuery("categories", async () => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/problem-categories`, {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    });
    return response.data.content; // لأن findAll يرجع Page
  });
};
