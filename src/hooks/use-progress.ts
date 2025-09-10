import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import keycloak from "@/lib/keycloak";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ProblemProgressDTO = {
  id: number;
  comment: string;
  percentage: number;
  progressDate: string;
  problemId: number;
  solutionId: number;
};

// ✅ إحضار آخر تقدم
export const useGetProblemProgress = (problemId: number) => {
  const fetchProgress = async (): Promise<ProblemProgressDTO | null> => {
    const accessToken = keycloak.token;
    const res = await axios.get(`${API_BASE_URL}/api/v1/problem/${problemId}/progress`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return Array.isArray(res.data) && res.data.length > 0
      ? res.data[res.data.length - 1]
      : null;
  };

  const { data, isLoading, error } = useQuery(
    ["problemProgress", problemId],
    fetchProgress,
    { enabled: !!problemId }
  );

  if (error) toast.error("فشل في تحميل التقدم");

  return { data, isLoading };
};

// ✅ إحضار كل التقدمات
export const useGetAllProblemProgress = (problemId: number) => {
  const fetchList = async (): Promise<ProblemProgressDTO[]> => {
    const accessToken = keycloak.token;
    const res = await axios.get(`${API_BASE_URL}/api/v1/problem/${problemId}/progress`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return Array.isArray(res.data) ? res.data : [];
  };

  const { data, isLoading, error } = useQuery(
    ["allProblemProgress", problemId],
    fetchList,
    { enabled: !!problemId }
  );

  if (error) toast.error("فشل في تحميل جميع التقدمات");

  return { progressList: data ?? [], isLoading };
};

// ✅ إنشاء تقدم
export const useCreateProblemProgress = (problemId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (progressData: Omit<ProblemProgressDTO, "id">) => {
      const accessToken = keycloak.token;
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/problem/${problemId}/progress`,
        progressData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["problemProgress", problemId]);
        queryClient.invalidateQueries(["allProblemProgress", problemId]);
        toast.success("تم إضافة تقدم جديد");
      },
      onError: () => toast.error("فشل في إضافة التقدم"),
    }
  );
};

// ✅ تعديل تقدم
export const useUpdateProblemProgress = (problemId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: ProblemProgressDTO) => {
      const accessToken = keycloak.token;
      const res = await axios.put(
        `${API_BASE_URL}/api/v1/problem/${problemId}/progress/${data.id}`,
        data,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["problemProgress", problemId]);
        queryClient.invalidateQueries(["allProblemProgress", problemId]);
      },
    }
  );
};



// ✅ حذف تقدم (مع الصور المرتبطة)
export const useDeleteProblemProgress = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ problemId, progressId }: { problemId: number; progressId: number }) => {
      const accessToken = keycloak.token;

      // 1. جلب كل التقدمات
      const { data: progresses } = await axios.get<
        { id: number; photoIds: number[] }[]
      >(`${API_BASE_URL}/api/v1/problem/${problemId}/progress`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // 2. العثور على التقدم المطلوب
      const progress = progresses.find((p) => p.id === progressId);
      if (!progress) throw new Error("لم يتم العثور على التقدم");

      // 3. حذف الصور المرتبطة
      if (progress.photoIds && progress.photoIds.length > 0) {
        await Promise.all(
          progress.photoIds.map((photoId) =>
            axios.delete(`${API_BASE_URL}/api/v1/problem/${problemId}/photos/${photoId}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
          )
        );
      }

      // 4. حذف التقدم نفسه
      await axios.delete(`${API_BASE_URL}/api/v1/problem/${problemId}/progress/${progressId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
    {
      onSuccess: (_, { problemId }) => {
        queryClient.invalidateQueries(["problemProgress", problemId]);
        queryClient.invalidateQueries(["allProblemProgress", problemId]);
        toast.success("تم حذف التقدم والصور المرتبطة به");
      },
      onError: () => toast.error("فشل في حذف التقدم"),
    }
  );
};
