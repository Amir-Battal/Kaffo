import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { toast } from "sonner";
import keycloak from "@/lib/keycloack";
import { User } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  } = useQuery("fetchCurrentUser", getMyUserRequest);

  if (error) {
    toast.error((error as Error).message);
  }

  return { currentUser, isLoading };
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
  firstName: string;
  lastName: string;
  phone: string | undefined;
  email: string;
  
  governorate?: string;
  address?: string;
  birth?: Date;
  study?: string;
  work?: string;
  about?: string;
};

export const  useUpdateUserBasicInfo = () => {
  const updateUserBasicInfoRequest = async (data: UpdateUserBasicInfoRequest) => {
    const accessToken = keycloak.token;

    const response = await axios.put(`${API_BASE_URL}/api/v1/users/${data.id}`, {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      governorate: data.governorate,
      address: data.address,
      birth: data.birth,
      study: data.study,  
      work: data.work,
      about: data.about
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
    toast.success("تم تحديث البيانات الأساسية بنجاح!");
  }

  if (error) {
    toast.error((error as Error).message);
    reset();
  }

  return { updateUserBasicInfo, isLoading };
};