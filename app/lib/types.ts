export interface HttpResponseType<T> {
  status: {
    code: number;
    message: string;
  };
  result: T;
}
