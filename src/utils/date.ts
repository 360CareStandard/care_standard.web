export const toDateInputValue = (iso?: string) => {
  if (!iso) return "";
  return iso.split("T")[0]; // YYYY-MM-DD
};
