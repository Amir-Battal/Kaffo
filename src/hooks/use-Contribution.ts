import axios from "axios";
import keycloak from "@/lib/keycloak";
// import { SolutionDTO } from "@/types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { SolutionDTO } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetContributions = ( problemId : Number) => {
  const accessToken = keycloak.token;

  const fetchContributions = async () => {
    const { data: contributions }: {data: SolutionDTO} = await axios.get(
      `${API_BASE_URL}/api/v1/problems/${problemId}/solutions`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const detailedSolutions = await Promise.all(
      contributions.map(async (contribution : any) => {
        const [userRes, problemRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/v1/users/${contribution.proposedByUserId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          axios.get(`${API_BASE_URL}/api/v1/problems/${contribution.problemId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        ]);

        return {
          ...contribution,
          user: userRes.data,
          problem: problemRes.data,
        };
      })
    );

    return detailedSolutions;
  };

  const queryKey = ["solutions", problemId];

  const { data, isLoading, isError, error } = useQuery(queryKey, fetchContributions);

  return {
    contributions: data ?? [],
    isLoading,
    isError,
    error,
  };
};

export const useGetMyContribution = (problemId: number) => {
  const accessToken = keycloak.token;

  return useQuery<SolutionDTO | null>({
    queryKey: ["mySolution", problemId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/v1/problems/${problemId}/solutions/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return res.data?.find((solution: any) => solution.problemId === problemId) || null;
    },
  });
};



export const useCreateContribution = (problemId: number) => {
  const queryClient = useQueryClient();
  const accessToken = keycloak.token;

  return useMutation({
    mutationFn: async (data: Partial<SolutionDTO>) => {
      const res = await axios.post(`${API_BASE_URL}/api/v1/problems/${problemId}/solutions`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["solutions", problemId]);
      queryClient.invalidateQueries(["mySolution", problemId]);
    },
  });
};

export const useUpdateContribution = (problemId: number, solutionId: number) => {
  const queryClient = useQueryClient();
  const accessToken = keycloak.token;

  return useMutation({
    mutationFn: async (data: Partial<SolutionDTO>) => {
      const res = await axios.put(`${API_BASE_URL}/api/v1/problems/${problemId}/solutions/${solutionId}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["solutions", problemId]);
      queryClient.invalidateQueries(["mySolution", problemId]);
    },
  });
};


export const useDeleteContribution = (problemId: number, solutionId: number) => {
  const queryClient = useQueryClient();
  const accessToken = keycloak.token;

  return useMutation({
    mutationFn: async () => {
      await axios.delete(`${API_BASE_URL}/api/v1/problems/${problemId}/solutions/${solutionId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["solutions", problemId]);
      queryClient.invalidateQueries(["mySolution", problemId]);
    },
  });
};



export const useGetAcceptedContribution = (problemId: number) => {
  const accessToken = keycloak.token;

  return useQuery<SolutionDTO | null>({
    queryKey: ["acceptedContribution", problemId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/v1/problems/${problemId}/solutions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const allSolutions: SolutionDTO[] = res.data;
      const acceptedSolution = allSolutions.find((sol) => sol.status === "ACCEPTED" && sol.proposedByUserId !== sol.acceptedByUserId) ?? null;


      return acceptedSolution;
    },
    enabled: !!problemId,
  });
};

export const useGetSolutionById = (problemId: number, solutionId?: number) => {
  const accessToken = keycloak.token;

  return useQuery<SolutionDTO | null>({
    queryKey: ["onlyAcceptedContribution", problemId, solutionId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/v1/problems/${problemId}/solutions/${solutionId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return res.data;
    },
    enabled: !!problemId && !!solutionId,
  });
};


export const useGetPendingContributions = (problemId: number) => {
  const accessToken = keycloak.token;

  return useQuery<SolutionDTO[]>({
    queryKey: ["pendingContributions", problemId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/v1/problems/${problemId}/solutions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const allSolutions: SolutionDTO[] = res.data;
      const pendingSolutions = allSolutions.filter((sol) => sol.status === 'PENDING_APPROVAL');

      return pendingSolutions;
    },
    enabled: !!problemId,
  });
};


export const useGetAllProblemsContribution = (problemId: number) => {
  const accessToken = keycloak.token;

  return useQuery<SolutionDTO[]>({
    queryKey: ["elseContributions", problemId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/v1/problems/${problemId}/solutions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const allSolutions: SolutionDTO[] = res.data;
      const elseSolutions = allSolutions.filter((sol) => sol.acceptedByUserId !== sol.proposedByUserId);

      return elseSolutions;
    },
    enabled: !!problemId,
  });
};



export const useGetGovSolution = (problemId: number) => {
  const accessToken = keycloak.token;

  return useQuery<SolutionDTO | null>({
    queryKey: ["govSolution", problemId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/v1/problems/${problemId}/solutions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const allSolutions: SolutionDTO[] = res.data;
      const govSolution = allSolutions.find(
        (sol) =>
          sol.status === "ACCEPTED" &&
          sol.proposedByUserId === sol.acceptedByUserId
      ) ?? null;


      return govSolution;
    },
    enabled: !!problemId,
  });
};




interface SelectParams {
  problemId: number;
  currentUser: any;
  contributions: SolutionDTO[];
  onSuccess?: (selected: SolutionDTO) => void;
}
export const useSelectContribution = ({
  problemId,
  currentUser,
  contributions,
  onSuccess,
}: SelectParams) => {
  const accessToken = keycloak.token;

  return useMutation({
    mutationFn: async (contribution: SolutionDTO) => {
      const acceptedId = contribution.id;

      // Accept selected contribution
      await axios.put(
        `${API_BASE_URL}/api/v1/problems/${problemId}/solutions/${acceptedId}`,
        {
          ...contribution,
          status: "ACCEPTED",
          acceptedByUserId: currentUser?.id,
          acceptedReason: `تم اختيار الحل من قبل ${currentUser?.firstName} ${currentUser?.lastName}`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Reject others
      const rejectPromises = contributions
        .filter((c) => c.id !== acceptedId)
        .map((c) =>
          axios.put(
            `${API_BASE_URL}/api/v1/problems/${problemId}/solutions/${c.id}`,
            {
              ...c,
              status: "REJECTED",
              acceptedByUserId: null,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          )
        );

      await Promise.all(rejectPromises);

      return contribution;
    },
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("فشل في تحديث حالة المساهمات:", error);
    },
  });
};




interface UnSelectParams {
  problemId: number;
  contributions: SolutionDTO[];
  onSuccess?: () => void;
}


export const useUnselectContribution = ({ problemId, contributions, onSuccess }: UnSelectParams) => {
  const accessToken = keycloak.token;

  return useMutation({
    mutationFn: async () => {
      const updatePromises = contributions.map((c) =>
        axios.put(
          `${API_BASE_URL}/api/v1/problems/${problemId}/solutions/${c.id}`,
          {
            ...c,
            status: "PENDING_APPROVAL",
            acceptedByUserId: null,
            acceptedReason: null,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        )
      );

      await Promise.all(updatePromises);
    },
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("فشل في إعادة تعيين حالة المساهمات:", error);
    },
  });
};




interface UpdateDatesParams {
  problemId?: number;
  onSuccess?: (updated: SolutionDTO) => void;
}

interface UpdateDatesPayload {
  contributionId: number;
  startDate: string;
  endDate: string;
}

export const useUpdateContributionDates = ({ problemId, onSuccess }: UpdateDatesParams) => {
  const accessToken = keycloak.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contributionId, startDate, endDate }: UpdateDatesPayload) => {
      if (!problemId) throw new Error("problemId غير موجود");

      // 1. جلب البيانات الحالية للمساهمة
      const { data: existing } = await axios.get<SolutionDTO>(
        `${API_BASE_URL}/api/v1/problems/${problemId}/solutions/${contributionId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 2. إرسال البيانات بعد تعديل التاريخ فقط
      const updated = {
        ...existing,
        startDate,
        endDate,
      };

      const { data: updatedSolution } = await axios.put(
        `${API_BASE_URL}/api/v1/problems/${problemId}/solutions/${contributionId}`,
        updated,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return updatedSolution;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["solutions", problemId]);
      queryClient.invalidateQueries(["mySolution", problemId]);
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (err) => {
      console.error("خطأ في تحديث التواريخ:", err);
    },
  });
};