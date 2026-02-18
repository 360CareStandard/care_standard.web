import axios from "axios";
import { FieldValues, UseFormSetError } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ApiError } from "@/types/api-error";

export function handleFormApiError<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
  fallbackMessage = "Something went wrong",
) {
  if (!axios.isAxiosError(err)) {
    toast.error(fallbackMessage);
    return;
  }

  const data = err.response?.data as ApiError<T> | undefined;

  // 1️⃣ Field-level validation errors (create/update forms)
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    data.errors.forEach(({ field, message }) => {
      setError(field as any, {
        type: "server",
        message,
      });
    });
    return;
  }

  // 2️⃣ Non-field / business errors (404, 403, 500, etc.)
  const message =
    data?.message ??
    (typeof data?.error === "string" ? data.error : data?.error?.message) ??
    err.message ??
    fallbackMessage;

  toast.error(message);
}
