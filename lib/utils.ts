import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isErrorWithMessage(
  error: unknown
): error is { message: string; statusCode?: number } {
  if (typeof error !== "object" || error === null || !("message" in error)) {
    return false;
  }

  return typeof (error as Record<string, unknown>).message === "string";
}
