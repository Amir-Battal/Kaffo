// src/hooks/use-donation.ts
import axios from "axios";
import keycloak from "@/lib/keycloak";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type DonationRequest = {
  amount: number;
  currency: string;
  paymentMethod: string;
  isAnonymous: boolean;
  successUrl: string;
  cancelUrl: string;
  idempotencyKey: string;
};

type DonationResponse = {
  sessionUrl: string;
};


export type Donation = {
  id: number;
  problemId: number;
  donorId: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentTransactionId: string;
  status: string;
  isAnonymous: boolean;
  donationDate: string;
  idempotencyKey?: string | null;
};

type PaginatedDonations = {
  content: Donation[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};


export const useCreateDonation = (problemId: number) => {
  const accessToken = keycloak.token;

  return useMutation<DonationResponse, Error, DonationRequest>({
    mutationFn: (data) =>
      axios
        .post(`${API_BASE_URL}/api/v1/problems/${problemId}/donations`, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data),
  });
};

export const useGetProblemDonations = (problemId: number) => {
  const accessToken = keycloak.token;

  return useQuery<Donation[], Error>({
    queryKey: ["problem-donations", problemId],
    queryFn: async () => {
      try {
        const response = await axios.get<PaginatedDonations>(
          `${API_BASE_URL}/api/v1/problems/${problemId}/donations`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const { content } = response.data;

        if (!Array.isArray(content)) {
          throw new Error("فشل في تحميل قائمة التبرعات");
        }

        return content;
      } catch (error: any) {
        const message = error?.response?.data?.message || error.message || "حدث خطأ غير متوقع";
        toast.error(`خطأ في تحميل التبرعات: ${message}`);
        throw new Error(message);
      }
    },
    staleTime: 1000 * 60 * 5, // Cache 5 دقائق
  });
};




export const useGetMyDonations = () => {
  const accessToken = keycloak.token;

  return useQuery<Donation[], Error>({
    queryKey: ["my-donations"],
    queryFn: async () => {
      try {
        const response = await axios.get<Donation[]>(
          `${API_BASE_URL}/api/v1/users/me/donations`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        const message = error?.response?.data?.message || error.message || "حدث خطأ غير متوقع";
        toast.error(`فشل تحميل التبرعات: ${message}`);
        throw new Error(message);
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};





// src/hooks/use-donation.ts (أضف هذا الجزء)

type PublicDonor = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
};

export const useGetPublicDonors = (problemId: number) => {

  const accessToken = keycloak.token;

  return useQuery<PublicDonor[], Error>({
    queryKey: ["public-donors", problemId],
    queryFn: async () => {
      try {
        const response = await axios.get<PublicDonor[]>(
          `${API_BASE_URL}/api/v1/problems/${problemId}/donations/public`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        const message = error?.response?.data?.message || error.message || "فشل تحميل أسماء المتبرعين";
        toast.error(`خطأ: ${message}`);
        throw new Error(message);
      }
    },
    staleTime: 1000 * 60 * 10,
  });
};
