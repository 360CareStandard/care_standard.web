import { ClientFormData } from "../schemas/add-client";

export type StepIndicatorProps = {
  current: number;
  steps: { id: string; label: string }[];
};
export type ClientWizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ClientFormData) => void;
  defaultValues?: Partial<ClientFormData>;
  title?: string;
};
