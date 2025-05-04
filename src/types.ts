export type User = {
  id: string;
  keycloakId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  photoUrl?: string;

  birth?: Date;
  study?: string;
  work?: string;
  about?: string;
  address?: string;
  governorate?: string;
};