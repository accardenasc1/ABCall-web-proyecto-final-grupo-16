export interface BaseResponse<T> {
    status: number | null;
    message: string | null;
    data: T | null;
  }