// src/api/menu.ts
import { get } from ".";
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
};
export type MenuListResponse = { data: MenuItem[]; meta: { total: number } };

export const MenuApi = {
  list: (params?: {
    q?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
  }) => get<MenuListResponse>("/menu", params),
};
