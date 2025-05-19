import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import keycloak from "@/lib/keycloak";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ProblemProgressDTO = {
  id: number;
  percentage: number;
  comment: string;
  createdAt: string;
};

type CreateProblemProgressRequest = {
  percentage: number;
  comment: string;
};

// ============= GET PROGRESS FOR PROBLEM =============
export const useGetProblemProgress = (problemId: number) => {
  const accessToken = keycloak.token;

  const fetchProgress = async (): Promise<ProblemProgressDTO[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/problem/${problemId}/progress`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  const { data, isLoading, isError, error } = useQuery(
    ["problemProgress", problemId],
    fetchProgress,
    { enabled: !!problemId }
  );

  if (error) {
    toast.error((error as Error).message);
  }

  return {
    progressList: data ?? [],
    isLoading,
    isError,
  };
};

// ============= ADD NEW PROGRESS ENTRY =============
export const useAddProblemProgress = (problemId: number) => {
  const queryClient = useQueryClient();

  const accessToken = keycloak.token;

  const addProgress = async (progressData: CreateProblemProgressRequest) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/v11/problem/${problemId}/progress`,
      progressData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  const {
    mutateAsync: submitProgress,
    isLoading,
    isSuccess,
    error,
    reset,
  } = useMutation(addProgress, {
    onSuccess: () => {
      toast.success("تم إضافة تقدم جديد بنجاح!");
      queryClient.invalidateQueries(["problemProgress", problemId]);
    },
  });

  if (error) {
    toast.error((error as Error).message);
    reset();
  }

  return { submitProgress, isLoading, isSuccess };
};
