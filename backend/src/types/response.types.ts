export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TFieldError = {
  field: string;
  message: string;
};

export type TApiResponse<T = null> = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: TMeta;
  errors?: TFieldError[];
  stack?: string;
};


