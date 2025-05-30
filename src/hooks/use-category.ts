// hooks/use-category.ts
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "sonner";
import keycloak from "@/lib/keycloak";

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
        // toast.success("تم إنشاء الصنف بنجاح!");
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


export const useCategoriesByGovId = (govId?: number) => {
  return useQuery(
    ["categories", govId],
    async () => {
      const response = await axios.get(`${API_BASE_URL}/api/v1/problem-categories`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
        params: {
          govId,
        },
      });
      return response.data || [];
    },
    {
      enabled: !!govId, // لا يتم التفعيل إلا إذا كان govId موجوداً
    }
  );
};


// useAllCategories
export const useAllCategories = () => {
  return useQuery("categories", async () => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/problem-categories`, {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    });
    return response.data; // لأن findAll يرجع Page
  });
};


// تعديل صنف
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (category: Category) => {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/problem-categories/${category.id}`,
        category,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        // toast.success("تم تحديث الصنف بنجاح!");
        queryClient.invalidateQueries("categories");
      },
      onError: (error: any) => {
        toast.error(error.message || "حدث خطأ أثناء تحديث الصنف.");
      },
    }
  );
};
