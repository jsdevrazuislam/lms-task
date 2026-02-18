import type { Response } from 'express';

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?:
    | {
        page: number;
        limit: number;
        total: number;
      }
    | undefined;
  data?: T | null;
}

const sendResponse = <T>(res: Response, data: IResponse<T>): void => {
  const responseData: IResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta,
    data: data.data || null,
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
