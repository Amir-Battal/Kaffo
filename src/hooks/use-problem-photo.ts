// hooks/useProblemPhoto.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import keycloak from "@/lib/keycloak";
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
  file: File;
};

export const useCreateProblemPhoto = () => {
  const queryClient = useQueryClient();

  const createPhoto = async ({ problemId, file }: CreateProblemPhotoInput) => {
    const accessToken = keycloak.token;

    // 1. طلب Presigned PUT URL
    const presignRes = await fetch(`${API_BASE_URL}/api/v1/problem-photos/presign?problemId=${problemId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!presignRes.ok) throw new Error("فشل في جلب presigned URL");

    const { s3Key: presignedUrl } = await presignRes.json();

    // 2. رفع الصورة إلى S3
    const uploadRes = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) throw new Error("فشل في رفع الصورة إلى S3");

    // 3. إنشاء سجل الصورة في قاعدة البيانات باستخدام نفس الـ presigned URL بدون query params (إن أمكن)
    const photoUrl = presignedUrl.split("?")[0]; // لإزالة التواقيع المؤقتة

    const createPhotoRes = await axios.post(`${API_BASE_URL}/api/v1/problem-photos`, {
      problemId,
      photoUrl,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return createPhotoRes.data;
  };

  const {
    mutateAsync: createProblemPhoto,
    isLoading,
    error,
  } = useMutation(createPhoto, {
    onSuccess: () => {
      toast.success("✅ تم رفع صورة المشكلة!");
      queryClient.invalidateQueries("problemPhotos");
    },
    onError: () => {
      toast.error("❌ فشل رفع صورة المشكلة");
    },
  });

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
