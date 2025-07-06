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


// جلب التصنيفات حسب الجهة المعنية
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


// جلب كافة التصنيفات
export const useAllCategories = () => {
  return useQuery("categories", async () => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/problem-categories`, {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    });
    return response.data; // لأن findAll يرجع Page
  });
};


export interface CreateCategoryPayload {
  name: string;
  govId: number;
}

// إنشاء تصنيف
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: CreateCategoryPayload) => {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/problem-categories`,
        data, // ← بدون id
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
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["categories", variables.govId]);
        toast.success("تمت إضافة التصنيف بنجاح");
      },
      onError: (error: any) => {
        toast.error(error.message || "فشل في إضافة التصنيف");
      },
    }
  );
};



// تعديل تصنيف
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


// حذف التصنيف
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id }: { id: number }) => {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/problem-categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["categories", variables.govId]);
        toast.success("تم حذف التصنيف");
      },
      onError: (error: any) => {
        if (
          error?.response?.data?.message?.includes("violates foreign key constraint")
        ) {
          toast.error("لا يمكن حذف التصنيف لأنه مستخدم في مشاكل حالية.");
        } else {
          toast.error("فشل في حذف التصنيف.");
        }
      }
    }
  );
};
