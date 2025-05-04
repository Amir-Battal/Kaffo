// hooks/useProblemPhoto.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import keycloak from "@/lib/keycloack";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ProblemPhotoDTO = {
  id: number;
  problemId: number;
  photoUrl: string;
  photoDate: string;
};

// ============= GET PHOTOS BY PROBLEM ID =============
export const useGetProblemPhotos = (problemId: number) => {
  const fetchPhotos = async (): Promise<ProblemPhotoDTO[]> => {
    const accessToken = keycloak.token;

    const response = await axios.get(`${API_BASE_URL}/api/v1/problem-photos/by-problem/${problemId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };

  const { data, isLoading, error } = useQuery(["problemPhotos", problemId], fetchPhotos, {
    enabled: !!problemId,
  });

  if (error) toast.error("حدث خطأ أثناء جلب صور المشكلة");

  return { photos: data ?? [], isLoading };
};

// ============= CREATE PHOTO (BY URL) =============
type CreateProblemPhotoInput = {
  problemId: number;
  photoUrl: string; // مرفوعة مسبقاً على Cloudinary أو S3 مثلاً
};

export const useCreateProblemPhoto = () => {
  const queryClient = useQueryClient();

  const createPhoto = async (data: CreateProblemPhotoInput) => {
    const accessToken = keycloak.token;

    const response = await axios.post(`${API_BASE_URL}/api/v1/problem-photos`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };

  const {
    mutateAsync: createProblemPhoto,
    isLoading,
    error,
    reset,
  } = useMutation(createPhoto, {
    onSuccess: () => {
      toast.success("تم إنشاء الصورة بنجاح!");
      queryClient.invalidateQueries("problemPhotos");
    },
  });

  if (error) {
    toast.error("فشل في إنشاء الصورة");
    reset();
  }

  return { createProblemPhoto, isLoading };
};

// ============= DELETE PHOTO =============
export const useDeleteProblemPhoto = () => {
  const queryClient = useQueryClient();

  const deletePhoto = async (photoId: number) => {
    const accessToken = keycloak.token;

    await axios.delete(`${API_BASE_URL}/api/v1/problem-photos/${photoId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  };

  const {
    mutateAsync: deleteProblemPhoto,
    isLoading,
    error,
  } = useMutation(deletePhoto, {
    onSuccess: () => {
      toast.success("تم حذف الصورة بنجاح!");
      queryClient.invalidateQueries("problemPhotos");
    },
  });

  if (error) {
    toast.error("فشل في حذف الصورة");
  }

  return { deleteProblemPhoto, isLoading };
};
