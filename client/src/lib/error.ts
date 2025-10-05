import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    
    if (data?.errors?.length) {
      // Handle validation errors
      const errorMessages = data.errors.map(err => `${err.field}: ${err.message}`);
      errorMessages.forEach(msg => toast.error(msg));
      return errorMessages[0]; // Return first error for display
    }
    
    if (data?.message) {
      return data.message;
    }

    // Handle specific HTTP status codes
    switch (error.response?.status) {
      case 401:
        return 'Please log in to continue';
      case 403:
        return 'You do not have permission to perform this action';
      case 404:
        return 'The requested resource was not found';
      case 409:
        return 'A conflict occurred with the current state';
      case 413:
        return 'The file you are trying to upload is too large';
      case 429:
        return 'Too many requests. Please try again later';
      default:
        return error.message || 'An unexpected error occurred';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof AxiosError && !error.response;
};

export const isAuthenticationError = (error: unknown): boolean => {
  return error instanceof AxiosError && error.response?.status === 401;
};

export const isValidationError = (error: unknown): boolean => {
  if (!(error instanceof AxiosError)) return false;
  const data = error.response?.data as ApiErrorResponse | undefined;
  return !!data?.errors?.length;
};