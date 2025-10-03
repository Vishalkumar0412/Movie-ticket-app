export interface IApiResponse<T> {
  success: boolean;       
  data?: T;               
  message: string;       
  errors?: any;           
}

// Export a type alias for convenience
export type ApiResponse<T> = IApiResponse<T>;