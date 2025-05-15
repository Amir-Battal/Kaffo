import { useQuery } from "react-query";
import axios from "axios";
import { toast } from "sonner";
import keycloak from "@/lib/keycloak";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type Donation = {
  id: number;
  amount: number;
  currency: string;
  donationDate: string;
  problemId: number;
  donorId: number;
  paymentMethod: string;
  status: string;
  isAnonymous: boolean;
};

type UseGetMyDonationsParams = {
  donorId?: number;
  page?: number;
  size?: number;
};

export const useGetMyDonations = ({ donorId, page = 0, size = 6 }: UseGetMyDonationsParams) => {
  const getMyDonations = async (): Promise<Donation[]> => {
    const accessToken = keycloak.token;

    if (!donorId) throw new Error("لم يتم العثور على معرف المستخدم");

    const response = await axios.get(`${API_BASE_URL}/api/v1/donations/by-donor/${donorId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data; // هنا نرجع المصفوفة الكاملة
  };

  const { data, isLoading, error } = useQuery(
    ["fetchMyDonations", donorId],
    getMyDonations,
    {
      enabled: !!donorId,
    }
  );

  if (error) {
    toast.error((error as Error).message);
  }

  // تقطيع البيانات يدويًا حسب الصفحة
  const allDonations = data ?? [];
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedDonations = allDonations.slice(startIndex, endIndex);

  const totalPages = Math.ceil(allDonations.length / size);

  return {
    donations: paginatedDonations,
    totalPages,
    isLoading,
  };
};

