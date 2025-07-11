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
  s3Key: string;
};

// ============= GET PHOTOS BY PROBLEM ID =============
export const useGetProblemPhotos = (problemId: number) => {
  const fetchPhotos = async (): Promise<ProblemPhotoDTO[]> => {
    const accessToken = keycloak.token;

    const response = await axios.get(`${API_BASE_URL}/api/v1/problem/${problemId}/photos`, {
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


export const usePresignedUpload = () => {
  // تعديل الدالة لتستقبل progressId
  const getPresignedUrls = async (
    problemId: number,
    count: number,
    contentType?: string,
    progressId?: number // ✅ جديد
  ): Promise<{ presignedUrl: string; s3Key: string; photoId: number }[]> => {
    const accessToken = keycloak.token;

    const url = new URL(`${API_BASE_URL}/api/v1/problem/${problemId}/photos`);
    url.searchParams.append("count", count.toString());
    if (contentType) {
      url.searchParams.append("contentType", contentType);
    }

    if (progressId) {
      url.searchParams.append("progressId", progressId.toString()); // ✅ إرسال progressId
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("فشل في جلب روابط التحميل الموقعة");
    }

    return response.json();
  };


  const uploadFileToS3 = async (url: string, file: File): Promise<void> => {
    const res = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!res.ok) {
      throw new Error(`فشل رفع الصورة: ${file.name}`);
    }
  };

  return { getPresignedUrls, uploadFileToS3 };
};


// ============= DELETE SINGLE PHOTO =============
export const useDeleteProblemPhoto = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async ({ problemId, photoId }: { problemId: number; photoId: number }) => {
      const accessToken = keycloak.token;
      await axios.delete(
        `${API_BASE_URL}/api/v1/problem/${problemId}/photos/${photoId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    {
      onSuccess: (_, { problemId }) => {
        queryClient.invalidateQueries(["problemPhotos", problemId]);
        toast.success("تم حذف الصورة بنجاح");
      },
      onError: () => {
        toast.error("فشل في حذف الصورة");
      },
    }
  );

  return mutation;
};






// hooks/use-progress.ts
export const useUpdateProblemProgress = () => {
  return useMutation(
    async (progress: {
      id: number;
      comment: string;
      percentage: number;
      progressDate: string;
      problemId: number;
      solutionId: number;
      photoIds: number[];
    }) => {
      const accessToken = keycloak.token;
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/problem/${progress.problemId}/progress/${progress.id}`,
        progress,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    }
  );
};



// ============= DELETE ALL PHOTOS FOR A PROBLEM =============
export const useDeleteAllProblemPhotos = () => {
  const mutation = useMutation(
    async (problemId: number) => {
      const accessToken = keycloak.token;
      await axios.delete(`${API_BASE_URL}/api/v1/problem/${problemId}/photos`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    {
      onError: () => {
        toast.error("فشل في حذف صور المشكلة");
      },
    }
  );

  return mutation;
};
