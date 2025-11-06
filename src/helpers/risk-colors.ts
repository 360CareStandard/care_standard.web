// Define color styles for each level
export const riskColorMap: Record<string, { bg: string; text: string }> = {
  high: { bg: "bg-red-100", text: "text-red-700" },
  medium: { bg: "bg-yellow-100", text: "text-yellow-700" },
  low: { bg: "bg-green-100", text: "text-green-700" },
};

// Default style if riskLevel is missing or unrecognized
