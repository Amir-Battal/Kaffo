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
      const acceptedSolution = allSolutions.find((sol) => sol.status === "ACCEPTED") ?? null;

      return acceptedSolution;
    },
    enabled: !!problemId,
  });
};