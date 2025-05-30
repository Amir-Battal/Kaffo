import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import keycloak from "@/lib/keycloak";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ GET All Progress of a Problem
export const useGetProblemProgress = (problemId: number) => {
  const fetchProgress = async (): Promise<any> => {
    const accessToken = keycloak.token;
    const res = await axios.get(`${API_BASE_URL}/api/v1/problem/${problemId}/progress`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // إذا كانت البيانات مصفوفة، ارجع آخر عنصر، وإلا ارجع البيانات كما هي
    if (Array.isArray(res.data)) {
      return res.data.length > 0 ? res.data[res.data.length - 1] : null;
    }
    return res.data;
  };

  const { data, isLoading, error } = useQuery(["problemProgress", problemId], fetchProgress, {
    enabled: !!problemId,
  });

  if (error) toast.error("فشل في تحميل التقدم");

  return { data, isLoading };
};



// ✅ GET All Progress of a Problem
export const useGetAllProblemProgress = (problemId: number) => {
  const fetchProgressList = async (): Promise<any[]> => {
    const accessToken = keycloak.token;
    const res = await axios.get(`${API_BASE_URL}/api/v1/problem/${problemId}/progress`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return Array.isArray(res.data) ? res.data : [];
  };

  const { data, isLoading, error } = useQuery(["allProblemProgress", problemId], fetchProgressList, {
    enabled: !!problemId,
  });

  if (error) toast.error("فشل في تحميل جميع التقدمات");

  return { progressList: data ?? [], isLoading };
};



// ✅ POST Create Progress
export const useCreateProblemProgress = (problemId: number) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (progressData: Omit<ProblemProgressDTO, "id">) => {
      const accessToken = keycloak.token;

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/problem/${problemId}/progress`,
        progressData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["problemProgress", problemId]);
        toast.success("تم إضافة تقدم جديد");
      },
      onError: () => {
        toast.error("فشل في إضافة التقدم");
      },
    }
  );

  return mutation;
};

// ✅ GET Single Progress
export const useGetSingleProgress = (problemId: number, progressId: number) => {
  const fetchOne = async (): Promise<ProblemProgressDTO> => {
    const accessToken = keycloak.token;
    const res = await axios.get(
      `${API_BASE_URL}/api/v1/problem/${problemId}/progress/${progressId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  };

  const { data, isLoading, error } = useQuery(
    ["singleProblemProgress", problemId, progressId],
    fetchOne,
    {
      enabled: !!problemId && !!progressId,
    }
  );

  if (error) toast.error("فشل في جلب التقدم المحدد");

  return { progress: data, isLoading };
};

// ✅ DELETE Progress
export const useDeleteProblemProgress = (problemId: number) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (progressId: number) => {
      const accessToken = keycloak.token;
      await axios.delete(`${API_BASE_URL}/api/v1/problem/${problemId}/progress/${progressId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["problemProgress", problemId]);
        toast.success("تم حذف التقدم بنجاح");
      },
      onError: () => {
        toast.error("فشل في حذف التقدم");
      },
    }
  );

  return mutation;
};
