export const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: "48px",
    borderColor: state.isFocused ? "#d1d5db" : "#d1d5db", // Green on focus
    borderRadius: "0.5rem",
    boxShadow: state.isFocused ? "0 0 0 1px #d1d5db" : "none", // Outline effect with green
    "&:hover": {
      borderColor: "#d1d5db", // Green border on hover
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999, // Ensure it appears above other content
  }),
  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#cbd5e1" : "#f0f0f0", // Background color of individual options
    color: state.isSelected ? "#009580" : "#000", // Text color of individual options
    "&:hover": {
      backgroundColor: "#cbd5e1", // Background color when an option is hovered
    },
  }),
};
