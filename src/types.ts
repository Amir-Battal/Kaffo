export type User = {
  id: string;
  keycloakId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  photoUrl?: string;
  cvUrl?: string;

  dateOfBirth?: Date;
  collegeDegree?: string;
  job?: string;
  description?: string;

  addressId?: number;
  govId?: number;
};

// types/problem.ts

export interface ProblemDTO {
  id?: number;
  title: string;
  description: string;
  isReal: boolean;
  forContribution: boolean;
  forDonation: boolean;
  submissionDate: string;
  status?: string;
  rejectionReason: string;
  addressId: number;
  submittedByUserId?: number;
  approvedByUserId?: number;
  categoryId: number;
  photoUrl?: string;
  lat?: number;
  lng?: number;
  createdDate: string;
  solutionProposal?: string;
  requiredBudget?: number;


  details?: string;
}


export interface SolutionDTO {
  id?: number;
  description?: string;
  estimatedCost?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  rating?: number;
  problemId?: number;
  proposedByUserId?: number;
  forContribution?: boolean;
  acceptedByUserId?: number;
};
