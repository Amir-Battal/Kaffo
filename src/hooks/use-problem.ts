// hooks/useProblem.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import keycloak from "@/lib/keycloak";
import { toast } from "sonner";
import { ProblemDTO } from "@/types";
import { useGetMyUser } from "./use-user";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type GetProblemsParams = {
  page: number;
  size?: number;
  sort?: string; // مثل ["submissionDate,desc"]
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
  forContribution?: boolean;
  forDonation?: boolean;
};

export enum ProblemStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
}


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


// ============= GET PROBLEMS FOR CONTRIBUTIONS =============

export const useGetProblemsForDonation = (
  { page, size = 6, sort = [] }: GetProblemsParams,
  criteria: ProblemCriteria
) => {
  const accessToken = keycloak.token;

  const fetchContributions = async (): Promise<ProblemPageResponse> => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/problems`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: {
        page,
        size,
        sort,
        forDonation: true, // أهم سطر
        ...criteria,
      },
    });
    return response.data;
  };

  const queryKey = ["contributions", page, size, sort, criteria];

  const { data, isLoading, isError, error } = useQuery(queryKey, fetchContributions);

  return {
    problems: data?.content ?? [],
    totalPages: data?.totalPages ?? 1,
    isLoading,
    isError,
    error,
  };
};



// ============= GET PROBLEMS FOR CONTRIBUTIONS =============

export const useGetProblemsForContribution = (
  { page, size = 6, sort = [] }: GetProblemsParams,
  criteria: ProblemCriteria
) => {
  const accessToken = keycloak.token;

  const fetchContributions = async (): Promise<ProblemPageResponse> => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/problems`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: {
        page,
        size,
        sort,
        forContribution: true, // أهم سطر
        ...criteria,
      },
    });
    return response.data;
  };

  const queryKey = ["contributions", page, size, sort, criteria];

  const { data, isLoading, isError, error } = useQuery(queryKey, fetchContributions);

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


// ============= GET PROBLEMS BY USER ID =============
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


// ============= GET PROBLEMS BY MY USER =============
export const useGetMyProblems = (
  { page, size = 6, sort = [] }: GetProblemsParams,
  criteria: ProblemCriteria
) => {
  const accessToken = keycloak.token;

  const fetchMyProblems = async (): Promise<ProblemPageResponse> => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/problems/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: {
        page,
        size,
        sort,
        ...criteria,
      },
    });
    return response.data;
  };

  const queryKey = ["myProblems", page, size, sort, criteria];

  const { data, isLoading, isError, error } = useQuery(queryKey, fetchMyProblems);

  if (error) {
    toast.error((error as Error).message);
  }

  return {
    problems: data?.content ?? [],
    totalPages: data?.totalPages ?? 1,
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
      // toast.success("تم إنشاء المشكلة بنجاح!");
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
      // toast.success("تم تحديث المشكلة بنجاح!");
      queryClient.invalidateQueries("fetchProblems");
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  return { updateProblem, isLoading, isSuccess, error, reset };
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
      // toast.success("تم حذف المشكلة بنجاح");
      queryClient.invalidateQueries("fetchProblems");
    },
  });

  if (error) {
    toast.error((error as Error).message);
  }

  return { deleteProblem, isLoading };
};



// ============= APPROVE OR REJECT PROBLEM =============
type ApproveProblemParams = {
  problemId: number;
  isReal: boolean;
  rejectionReason?: string;
};

export const useApproveOrRejectProblem = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useGetMyUser();

  return useMutation(
    async ({ problemId, isReal, rejectionReason }: ApproveProblemParams) => {
      const accessToken = keycloak.token;

      const userId = currentUser?.id;


      const payload: any = {
        isReal,
        approvedByUser: userId,
        rejectionReason,
      };

      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/problems/${problemId}`,
        payload,
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
        queryClient.invalidateQueries("problems");
        toast.success("تم تحديث حالة الشكوى بنجاح");
      },
      onError: (error: any) => {
        toast.error("حدث خطأ أثناء تحديث حالة الشكوى: " + error.message);
      },
    }
  );
};


type UpdateForContributionParams = {
  problemId: number;
  forContribution: boolean; // عادةً هنا نرسل القيمة الجديدة (true)
  isReal: boolean;
};

export const useUpdateProblemForContribution = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ problemId, forContribution, isReal }: UpdateForContributionParams) => {
      const accessToken = keycloak.token;

      const payload = {
        forContribution,
        isReal,
      };

      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/problems/${problemId}`,
        payload,
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
        queryClient.invalidateQueries("problems");
        toast.success("تم إسناد نوع الحل");
      },
      onError: (error: any) => {
        toast.error("حدث خطأ أثناء تحديث 'forContribution': " + error.message);
      },
    }
  );
};



export const rejectAllProblems = async (contributions: any, problemId: number) => {
  const accessToken = keycloak.token;
  try {
    const rejectPromises = contributions.map((c: any) =>
      c.status !== "ACCEPTED" &&
      axios.put(
        `${API_BASE_URL}/api/v1/problems/${problemId}/solutions/${c.id}`,
        {
          ...c,
          status: "REJECTED",
          acceptedByUserId: null,
          acceptedReason: "تم رفض المساهمة بسبب التكفل الذاتي بحل المشكلة",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          }
        }
      )
    );
    await Promise.all(rejectPromises);
  } catch (err) {
    console.error("فشل في رفض المساهمات بعد اختيار الحل الذاتي:", err);
  }
}
export const pendingAllProblems = async (contributions: any, problemId: number) => {
  const accessToken = keycloak.token;
  try {
    const rejectPromises = contributions.map((c: any) =>
      c.status !== "ACCEPTED" &&
      axios.put(
        `${API_BASE_URL}/api/v1/problems/${problemId}/solutions/${c.id}`,
        {
          ...c,
          status: "PENDING_APPROVAL",
          acceptedByUserId: null,
          acceptedReason: "تم رفض المساهمة بسبب التكفل الذاتي بحل المشكلة",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          }
        }
      )
    );
    await Promise.all(rejectPromises);
  } catch (err) {
    console.error("فشل في رفض المساهمات بعد اختيار الحل الذاتي:", err);
  }
}