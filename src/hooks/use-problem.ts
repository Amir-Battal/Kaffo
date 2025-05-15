// hooks/useProblem.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import keycloak from "@/lib/keycloak";
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

type ProblemCriteria = {
  searchText?: string;
  city?: string;
  status?: string;
  categoryId?: number;
};

// ============= GET ALL PROBLEMS =============

export const useGetAllProblems = (
  { page, size = 6, sort = [] }: GetProblemsParams,
  criteria: ProblemCriteria
) => {
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
        ...criteria, // مرر الفلاتر هنا
      },
    });
    return response.data;
  };

  const queryKey = ["problems", page, size, sort, criteria];

  const { data, isLoading, isError, error } = useQuery(queryKey, fetchProblems);

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

    return response.data;
  };

  const { data: problem, isLoading, error } = useQuery<ProblemDTO>(
    ["fetchProblem", id],
    fetchProblemById,
    {
      enabled: !!id,
    }
  );

  if (error) toast.error((error as Error).message);

  return { problem, isLoading };
};

export const useGetProblemsByUser = (userId: number) => {
  const accessToken = keycloak.token;

  const fetchUserProblems = async (): Promise<ProblemDTO[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/problems/by-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  const { data, isLoading, isError, error } = useQuery(
    ["userProblems", userId],
    fetchUserProblems,
    { enabled: !!userId }
  );

  if (error) {
    toast.error((error as Error).message);
  }

  return {
    problems: data ?? [],
    isLoading,
    isError,
  };
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

    const response = await axios.patch(`${API_BASE_URL}/api/v1/problems/${id}`, data, {
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


