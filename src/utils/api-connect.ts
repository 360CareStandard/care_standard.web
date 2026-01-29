import { AxiosError, AxiosRequestConfig } from "axios";
import { api } from "@/lib/axios";

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const { data } = await api.request<T>(config);
    return data;
  } catch (error) {
    // Preserve AxiosError for React Query + forms
    if (error instanceof AxiosError) {
      throw error;
    }
    throw error;
  }
}

// Convenience wrappers
export const apiGet = <T>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
) => request<T>({ method: "GET", url, params, ...config });

export const apiPost = <T>(
  url: string,
  body?: any,
  config?: AxiosRequestConfig,
) => request<T>({ method: "POST", url, data: body, ...config });

export const apiPatch = <T>(
  url: string,
  body?: any,
  config?: AxiosRequestConfig,
) => request<T>({ method: "PATCH", url, data: body, ...config });

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  request<T>({ method: "DELETE", url, ...config });
