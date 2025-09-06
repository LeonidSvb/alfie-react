export interface EmailSubmissionData {
  email: string;
  firstName?: string;
  lastName?: string;
  questionnaireSummary: Record<string, any>;
  flowType: 'inspire-me' | 'i-know-where';
  tripGuideId: string;
  tags: string[];
  submittedAt: Date;
}

export interface CRMSubmissionResponse {
  success: boolean;
  contactId?: string;
  message?: string;
  error?: string;
}

export interface EmailFormData {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface EmailGateState {
  isVisible: boolean;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  error?: string;
}