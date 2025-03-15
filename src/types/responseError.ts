export class ResponseError extends Error {
    status: number;
    details?: string;
  
    constructor(status: number, message: string, details?: string) {
      super(message);
      this.status = status;
      this.details = details;
      Object.setPrototypeOf(this, ResponseError.prototype);
    }
}

export function isResponseError(error: unknown): error is ResponseError {
    return (error as ResponseError).status !== undefined;
}