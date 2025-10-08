export interface JsonResponse<T> {
  status: number;
  message: string;
  data: T | null;
}

export function jsonResponse<T>(
  status: number,
  message: string,
  data: T | null = null
): JsonResponse<T> {
  return { status, message, data };
}