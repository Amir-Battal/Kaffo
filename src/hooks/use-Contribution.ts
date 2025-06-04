import axios from "axios";
import keycloak from "@/lib/keycloak";
// import { SolutionDTO } from "@/types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { SolutionDTO } from "@/types";
import { useGetMyUser } from "./use-user";
import { toast } from "sonner";

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



export type Contribution = {
  id: number;
  problemId: number;
  description: string;
  estimatedCost: number;
  status: string;
  acceptedReason: string;
  startDate: string;
  endDate: string;
  feedback: string;
  rating: number;
  proposedByUserId: number;
  acceptedByUserId: number;
  creationDate: string;
};

export const useGetMyContributions = () => {
  const accessToken = keycloak.token;

  return useQuery<Contribution[], Error>({
    queryKey: ["my-contributions"],
    queryFn: async () => {
      try {
        const response = await axios.get<Contribution[]>(
          `${API_BASE_URL}/api/v1/solutions/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        const message = error?.response?.data?.message || error.message || "حدث خطأ غير متوقع";
        toast.error(`فشل تحميل المساهمات: ${message}`);
        throw new Error(message);
      }
    },
    staleTime: 1000 * 60 * 5,
  });
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

  const { currentUser } = useGetMyUser();

  return useMutation({
    mutationFn: async (data: Partial<SolutionDTO>) => {
      const res = await axios.post(`${API_BASE_URL}/api/v1/problems/${problemId}/solutions`, {
        status: currentUser?.govId ? "APPROVED" : "PENDING_APPROVAL",
        acceptedByUserId: currentUser?.govId ? currentUser?.id : null,
        ...data,
      }, {
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

      console.log(allSolutions);
      const acceptedSolution = allSolutions.find((sol) => (sol.status === "APPROVED" || sol.status === "PENDING_FUNDING" || sol.status === "WORK_IN_PROGRESS" || sol.status === "RESOLVED") && sol.proposedByUserId !== sol.acceptedByUserId) ?? null;


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
          sol.status === "APPROVED" &&
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
          status: "APPROVED",
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
  status: string;
}

export const useUpdateContributionDates = ({ problemId, onSuccess }: UpdateDatesParams) => {
  const accessToken = keycloak.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contributionId, startDate, endDate, status }: UpdateDatesPayload) => {
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
        status,
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




interface UpdateSolutionStatus {
  problemId: number;
  solutionId: number;
  status: string;
}

export const useUpdateSolutionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ problemId, solutionId, status }: UpdateSolutionStatus) => {
      const accessToken = keycloak.token;

      const payload: Partial<SolutionDTO> = {
        status, // ✅ الآن أصبح معرفًا بشكل صحيح
      };

      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/problems/${problemId}/solutions/${solutionId}/status`,
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
        toast.success("تم تعديل حالة المساهمة");
      },
      onError: (error: any) => {
        toast.error("حدث خطأ أثناء تعديل 'contribution status': " + error.message);
      },
    }
  );
};
