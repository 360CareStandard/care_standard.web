export const badgeStyles = {
    low: "bg-gray-50 text-gray-700 hover:bg-gray-50 border-transparent",
    high: "bg-red-50 text-red-700 hover:bg-red-50 border-transparent",
    medium: "bg-orange-50 text-orange-700 hover:bg-orange-50 border-transparent",
    completed: "bg-green-50 text-green-700 hover:bg-green-50 border-transparent",
    critical: "bg-red-50 text-red-700 hover:bg-red-50 border-transparent",
};

export const statusStyles: Record<string, string> = {
    open: "bg-gray-100 text-gray-700 border-transparent",
    "under-review": "bg-yellow-50 text-yellow-700 border-transparent",
    "action-taken": "bg-blue-50 text-blue-700 border-transparent",
    closed: "bg-green-50 text-green-700 border-transparent",
};

export const formatStatus = (status: string) => {
    switch (status) {
        case "open":
            return "Open";
        case "under-review":
            return "Under Review";
        case "action-taken":
            return "Action Taken";
        case "closed":
            return "Closed";
        default:
            return status;
    }
};
export const formatPriority = (priority: string) => {
    switch (priority) {
        case "low":
            return "Low";
        case "medium":
            return "Medium";
        case "high":
            return "High";
        case "critical":
            return "Critical";
        default:
            return priority;
    }
};
