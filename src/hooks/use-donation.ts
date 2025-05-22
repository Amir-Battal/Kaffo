// src/hooks/use-donation.ts
import axios from "axios";
import { useMutation, useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


type DonationRequest = {
  amount: number;
  currency: string;
  paymentMethod: "STRIPE";
  isAnonymous: boolean;
  successUrl: string;
  cancelUrl: string;
  idempotencyKey: string;
};

type DonationResponse = {
  redirectUrl: string;
};

export const useCreateDonation = (problemId: number) => {
  return useMutation<DonationResponse, Error, DonationRequest>({
    mutationFn: (data) =>
      axios
        .post(`${API_BASE_URL}/api/v1/problems/${problemId}/donations`, data)
        .then((res) => res.data),
  });
};

export const useGetProblemDonations = (problemId: number) => {
  return useQuery({
    queryKey: ["problem-donations", problemId],
    queryFn: () =>
      axios.get(`${API_BASE_URL}/api/v1/problems/${problemId}/donations`).then((res) => res.data),
  });
};

export const useGetMyDonations = (problemId: number) => {
  return useQuery({
    queryKey: ["my-donations", problemId],
    queryFn: () =>
      axios.get(`${API_BASE_URL}/api/v1/problems/${problemId}/donations/me`).then((res) => res.data),
  });
};
