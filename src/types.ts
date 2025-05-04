export type User = {
  id: string;
  keycloakId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  photoUrl?: string;

  dateOfBirth?: Date;
  collegeDegree?: string;
  job?: string;
  description?: string;

  addressId?: number;
};