import { PaymentFormType } from "@/pages/schemas/finance";
import { useFormContext } from "react-hook-form";
import { TextField } from "@/components/shared/text-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";

const PaymentFormField = () => {
  const { register, formState, control } = useFormContext<PaymentFormType>();

  const { errors } = formState;
  return (
    <div className="w-full my-2 space-y-4">
      <TextField
        label="Amount"
        type="number"
        inputMode="decimal"
        min="0.01"
        step="0.01"
        {...register("amount", {
          valueAsNumber: true,
        })}
        error={errors.amount?.message}
      />
      <RHFSelectField
        control={control}
        name="paymentMethod"
        label="Payment Method *"
        options={[
          { value: "cash", label: "Cash" },
          { value: "bank-transfer", label: "Bank transfer" },
          { value: "card", label: "Card" },
        ]}
      />

      <TextField
        label="Reference (optional)"
        type="text"
        {...register("paymentReference")}
        error={errors.paymentReference?.message}
      />

      <TextField
        required
        label="Date Paid"
        type="date"
        {...register("datePaid")}
        error={errors.datePaid?.message}
      />
      <TextField
        required
        label="Upload Proof Payment"
        type="file"
        {...register("paymentProof")}
        error={errors.paymentProof?.message}
      />
    </div>
  );
};

export default PaymentFormField;
