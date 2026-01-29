import { AxiosError } from "axios";
import { FieldValues, UseFormSetError } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ApiError } from "@/types/api-error";

export function handleFormApiError<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
  fallbackMessage = "Something went wrong",
) {
  if (!(err instanceof AxiosError)) {
    toast.error(fallbackMessage);
    return;
  }

  const data = err.response?.data as ApiError<T> | undefined;

  // 1️⃣ Field-level errors
  if (data?.errors?.length) {
    data.errors.forEach(({ field, message }) => {
      setError(field, { type: "server", message });
    });
    return;
  }

  // 2️⃣ General message
  toast.error(data?.message ?? fallbackMessage);
}
