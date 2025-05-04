// hooks/useProblem.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import keycloak from "@/lib/keycloack";
import { toast } from "sonner";
import { ProblemDTO } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type GetProblemsParams = {
  page: number;
  size?: number;
  sort?: string[]; // مثل ["submissionDate,desc"]
};

type ProblemPageResponse = {
  content: ProblemDTO[];
  totalPages: number;
  totalElements: number;
  number: number;
};

// ============= GET ALL PROBLEMS =============
export const useGetAllProblems = ({ page, size = 6, sort = [] }: GetProblemsParams) => {
  const accessToken = keycloak.token;

  const fetchProblems = async (): Promise<ProblemPageResponse> => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/problems`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: {
        page,
        size,
        sort,
      },
    });
    return response.data;
  };

  const queryKey = ["problems", page, size, sort];

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery(queryKey, fetchProblems);

  return {
    problems: data?.content ?? [],
    totalPages: data?.totalPages ?? 1,
    isLoading,
    isError,
    error,
  };
};

// ============= GET ONE PROBLEM BY ID =============
export const useGetProblemById = (id: number) => {
  const fetchProblemById = async (): Promise<ProblemDTO> => {
    const accessToken = keycloak.token;

    const response = await axios.get(`${API_BASE_URL}/api/v1/problems/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data as ProblemDTO;
  };

  const { data: problem, isLoading, error } = useQuery(["fetchProblem", id], fetchProblemById, {
    enabled: !!id,
  });

  if (error) toast.error((error as Error).message);

  return { problem, isLoading };
};

// ============= CREATE PROBLEM =============
type CreateProblemRequest = Omit<ProblemDTO, "id" | "status" | "rejectionReason" | "submissionDate">;

export const useCreateProblem = () => {
  const queryClient = useQueryClient();

  const createProblemRequest = async (problem: CreateProblemRequest) => {
    const accessToken = keycloak.token;

    const response = await axios.post(`${API_BASE_URL}/api/v1/problems`, problem, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };

  const {
    mutateAsync: createProblem,
    isLoading,
    isSuccess,
    error,
    reset,
  } = useMutation(createProblemRequest, {
    onSuccess: () => {
      toast.success("تم إنشاء المشكلة بنجاح!");
      queryClient.invalidateQueries("fetchProblems");
    },
  });

  if (error) {
    toast.error((error as Error).message);
    reset();
  }

  return { createProblem, isLoading };
};

// ============= UPDATE PROBLEM =============
type UpdateProblemRequest = {
  id: number;
  data: Partial<ProblemDTO>;
};

export const useUpdateProblem = () => {
  const queryClient = useQueryClient();

  const updateProblemRequest = async ({ id, data }: UpdateProblemRequest) => {
    const accessToken = keycloak.token;

    const response = await axios.put(`${API_BASE_URL}/api/v1/problems/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };

  const {
    mutateAsync: updateProblem,
    isLoading,
    isSuccess,
    error,
    reset,
  } = useMutation(updateProblemRequest, {
    onSuccess: () => {
      toast.success("تم تحديث المشكلة بنجاح!");
      queryClient.invalidateQueries("fetchProblems");
    },
  });

  if (error) {
    toast.error((error as Error).message);
    reset();
  }

  return { updateProblem, isLoading };
};

// ============= DELETE PROBLEM =============
export const useDeleteProblem = () => {
  const queryClient = useQueryClient();

  const deleteProblemRequest = async (id: number) => {
    const accessToken = keycloak.token;

    await axios.delete(`${API_BASE_URL}/api/v1/problems/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  };

  const {
    mutateAsync: deleteProblem,
    isLoading,
    isSuccess,
    error,
  } = useMutation(deleteProblemRequest, {
    onSuccess: () => {
      toast.success("تم حذف المشكلة بنجاح");
      queryClient.invalidateQueries("fetchProblems");
    },
  });

  if (error) {
    toast.error((error as Error).message);
  }

  return { deleteProblem, isLoading };
};
