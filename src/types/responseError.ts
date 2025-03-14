export interface ResponseError extends Error {
    status: number;
    message: string;
    details?: string;
}

export function isResponseError(error: unknown): error is ResponseError {
    return (error as ResponseError).status !== undefined;
}