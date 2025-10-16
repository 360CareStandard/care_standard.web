// src/api/index.ts
import { api, publicApi } from "@/lib/axios";
import { AxiosRequestConfig } from "axios";

export const get = async <T>(url: string, params?: any, signal?: AbortSignal) =>
  (await api.get<T>(url, { params, signal })).data;

export const post = async <T, B = unknown>(url: string, body?: B) =>
  (await api.post<T>(url, body)).data;
export const postPublic = async <T, B = unknown>(
  url: string,
  body?: B,
  cfg?: AxiosRequestConfig
) => (await publicApi.post<T>(url, body, cfg)).data;

export const patch = async <T, B = unknown>(url: string, body?: B) =>
  (await api.patch<T>(url, body)).data;

export const del = async <T>(url: string) => (await api.delete<T>(url)).data;
