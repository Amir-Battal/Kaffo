import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { toast } from "sonner";
import keycloak from "@/lib/keycloak";
import { User } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const useAllUsers = () => {
  return useQuery("users", async () => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/users`, {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    });
    return response.data;
  });
};

// ============= GET USER =============
export const useGetMyUser = () => {
  const getMyUserRequest = async (): Promise<User> => {
    const accessToken = keycloak.token;

    const response = await axios.get(`${API_BASE_URL}/api/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data as User;
  };

  const {
    data: currentUser,
    isLoading,
    error,
    refetch, // <-- أضف هذا هنا
  } = useQuery(["fetchCurrentUser"], getMyUserRequest);

  if (error) {
    toast.error((error as Error).message);
  }

  return { currentUser, isLoading, refetch }; // <-- وأضفها هنا أيضاً
};


// ============= GET USER BY ID =============
export const useGetUserById = (userId: string, options = {}) => {
  return useQuery(
    ["user", userId],
    async () => {
      const accessToken = keycloak.token;

      const response = await axios.get(`${API_BASE_URL}/api/v1/users/${userId}`, {
        headers: {  
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data as User;
    },
    {
      enabled: !!userId,
      onError: (error: any) => {
        toast.error(error.message || "حدث خطأ أثناء جلب المستخدم");
      },
      ...options,
    }
  );
};

// ============= CREATE USER =============
type CreateUserRequest = {
  keycloakId: string;
  email: string;
};

export const useCreateMyUser = () => {
  const createMyUserRequest = async (user: CreateUserRequest) => {
    const accessToken = keycloak.token;

    await axios.post(`${API_BASE_URL}/api/my/user`, user, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  };

  const {
    mutateAsync: createUser,
    isLoading,
    isError,
    isSuccess,
  } = useMutation(createMyUserRequest);

  return {
    createUser,
    isLoading,
    isError,
    isSuccess,
  };
};

// ============= UPDATE USER =============
type UpdateUserBasicInfoRequest = {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string | undefined;
  email?: string;

  addressId?: number; // ✅ عدّل الاسم هنا ليتوافق أيضًا
  govId?: number; 

  dateOfBirth?: Date;
  collegeDegree?: string;
  job?: string;
  description?: string;
};


export const  useUpdateUserBasicInfo = () => {
  const updateUserBasicInfoRequest = async (data: UpdateUserBasicInfoRequest) => {
    const accessToken = keycloak.token;

    const response = await axios.put(`${API_BASE_URL}/api/v1/users/${data.id}`, {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,

      govId: data.govId,
      addressId: data.addressId,

      dateOfBirth: data.dateOfBirth,
      collegeDegree: data.collegeDegree,  
      job: data.job,
      description: data.description
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };
  

  const {
    mutateAsync: updateUserBasicInfo,
    isLoading,
    isSuccess,
    error,
    reset,
  } = useMutation(updateUserBasicInfoRequest);

  if (isSuccess) {
    toast("تم تعديل البيانات الأساسية بنجاح",{
      style:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        background: '#008c2f',
        color: '#fff',
        direction: 'rtl',
        border: 'none',
      },
      closeButton: true
    })
  }

  if (error) {
    toast.error((error as Error).message);
    reset();
  }

  return { updateUserBasicInfo, isLoading };
};


// ============= DELETE USER =============
export const useDeleteUser = () => {
  const deleteUserRequest = async (userId: string) => {
    const accessToken = keycloak.token;

    await axios.delete(`${API_BASE_URL}/api/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  };

  const {
    mutateAsync: deleteUser,
    isLoading,
    isSuccess,
    error,
  } = useMutation(deleteUserRequest);

  if (isSuccess) {
    toast.success("تم حذف المستخدم بنجاح");
  }

  if (error) {
    toast.error((error as Error).message);
  }

  return {
    deleteUser,
    isLoading,
  };
};


// ============= GET PHOTO Presigned URL =============
export const useUploadUserPhoto = () => {
  const getPresignedUrl = async (userId: any) => {
    const accessToken = keycloak.token;

    const res = await axios.post(
      `${API_BASE_URL}/api/v1/users/${userId.userId}/profile-photo?contentType=${userId.contentType}`,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const presignedUrl = res.data;
    const accessUrl = presignedUrl.split('?')[0];

    return { presignedUrl, accessUrl };
  };

  return useMutation(getPresignedUrl);
};



// ============= GET CV Presigned URL =============
export const useUploadUserCv = () => {
  const getPresignedUrl = async ({ userId, contentType }: { userId: number; contentType: string }) => {
    const accessToken = keycloak.token;

    const res = await axios.post(
      `${API_BASE_URL}/api/v1/users/${userId}/cv?contentType=${contentType}`,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const presignedUrl = res.data;
    const accessUrl = presignedUrl.split('?')[0]; // يمكن استخدامه لاحقًا لعرض الـ CV

    return { presignedUrl, accessUrl };
  };

  return useMutation(getPresignedUrl);
};




export const useGovUserInfo = (userId: string) => {
  const fetchGovUser = async (): Promise<User> => {
    const accessToken = keycloak.token;

    const response = await axios.get(`${API_BASE_URL}/api/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data as User;
  };

  return useQuery(["govUser", userId], fetchGovUser, {
    enabled: !!userId,
    onError: (error: any) => {
      toast.error(error.message || "فشل في جلب بيانات المستخدم الحكومي");
    },
  });
};



type UpdateGovUserInfoRequest = {
  id: string;
  address: string;
  description: string;
};

export const useUpdateGovUserInfo = () => {
  const updateRequest = async (data: UpdateGovUserInfoRequest) => {
    const accessToken = keycloak.token;

    await axios.put(`${API_BASE_URL}/api/v1/users/${data.id}`, {
      address: data.address,
      description: data.description,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  };

  return useMutation(updateRequest);
};

// ============= GET STATISTICS BY YEAR =============
export type StatisticItem = {
  title: string;
  ar_title: string;
  label: string;
  number: number;
  color: string;
  fill: string;
  path: string;
};

export const useUserStatisticsByYear = (year: number) => {
  return useQuery<StatisticItem[]>({
    queryKey: ["userStatistics", year],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/v1/users/statistics?year=${year}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      const data = response.data;

      return [
        {
          title: "issues",
          ar_title: "الشكاوي",
          label: "الشكاوي المقدمة من قبلك",
          number: data.issues,
          color: "red",
          fill: "bg-red-600",
          path: "/problems",
        },
        {
          title: "contributions",
          ar_title: "المساهمات",
          label: "المساهمات التي قمت بها",
          number: data.contributions,
          color: "green",
          fill: "bg-green-600",
          path: "/volunteering/contributions",
        },
        {
          title: "donations",
          ar_title: "التبرعات",
          label: "التبرعات التي قمت بها",
          number: data.donations,
          color: "purple",
          fill: "bg-purple-600",
          path: "/volunteering/donations",
        },
      ];

      // return Stats;
    },
    enabled: !!year,
  });
};


// export const useAssociateUserToGov = () => {
//   return useMutation({
//     mutationFn: async ({ userId, govId }: { userId: string; govId: number }) => {
//       const res = await axios.post(
//         `${API_BASE_URL}/api/v1/users/${userId}/associate-user?govId=${govId}`,
//         {}
//       )
//       if (res.status === 200 || res.status === 204) {
//         return true // نجاح
//       }
//       throw new Error("لم يتم الربط")
//     }
//   })
// }

export const useAssociateUserToGov = () => {
  return useMutation({
    mutationFn: async ({ userId, govId }: { userId: string; govId: number }) => {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/users/${userId}/associate-user?govId=${govId}`,
        {}, // body فارغ
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        return true; // نجاح
      }
      throw new Error("لم يتم الربط");
    },
  });
};


export function useAddRole() {
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await axios.put(
        `${API_BASE_URL}/api/v1/users/${userId}/add-role?newRole=${role}`,
        {}, // body فارغ
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      )
      return res.data
    },
  })
}