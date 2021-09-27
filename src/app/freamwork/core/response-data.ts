export interface ResponseData {
  meta: ResponseMetaData;
  data: ResponseContentData | unknown[] | null;
}

export interface ResponseMetaData {
  success: boolean;
  message: string;
  statusCode: number;
  popup: boolean;
}

export interface ResponseContentData {
  total: number;
  size: number;
  page: number;
  current: number;
  response: unknown[] | null;
}
