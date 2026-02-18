// src/types/api-error.ts
import { FieldPath, FieldValues } from "react-hook-form";

export type FieldError<T extends FieldValues> = {
  field: FieldPath<T>;
  message: string;
};

// export type ApiError<T extends FieldValues> = {
//   message?: string;
//   errors?: FieldError<T>[];
// };

export interface ApiError<T extends FieldValues> {
  message?: string;

  errors?: FieldError<T>[];

  error?: {
    message?: string;
    name?: string;
    stack?: string;
    [key: string]: any;
  };
}
