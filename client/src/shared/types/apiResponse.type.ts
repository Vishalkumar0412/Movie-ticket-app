

export interface IApiResponse<T=unknown> {
  success: boolean;       
  data?: T;               
  message: string;       
  errors?: any;           
}

// Export a type alias for convenience
export type ApiResponse<T> = IApiResponse<T>;