import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export interface BackendError {
    errors: Array<{
        code: string;
        message: string;
    }>;
    successful: boolean;
}

export interface ApiError extends Error {
    response?: {
        data?: BackendError;
        status?: number;
    };
}

export const handleApiError = (error: ApiError, fallbackMessage?: string) => {
    // Check if it's a backend error response
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const backendError = error.response.data as BackendError;
        const firstError = backendError.errors[0];
        
        // Show the first error message from the backend
        toast.error(fallbackMessage || "Operation failed", {
            description: firstError.message
        });
        
        return firstError;
    }
    
    // Fallback to generic error handling
    const errorMessage = error.message || fallbackMessage || "An unexpected error occurred";
    toast.error("Operation failed", {
        description: errorMessage
    });
    
    return null;
};

export const handleApiErrorWithContext = (
    error: ApiError, 
    context: { action: string; entityName?: string; entityValue?: string }
) => {
    const { action, entityName, entityValue } = context;
    
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const backendError = error.response.data as BackendError;
        const firstError = backendError.errors[0];    
    
        const localizedTitle = i18n.t(`events.${action}.error`, { 
            name: entityValue || entityName || "item" 
        });
        
        toast.error(localizedTitle, {
            description: firstError.message
        });
        
        return firstError;
    }
    
    
    const localizedTitle = i18n.t(`events.${action}.error`, { 
        name: entityValue || entityName || "item" 
    });
    
    const errorMessage = error.data.detail.body || i18n.t(`events.${action}.error.generic`);
    toast.error(localizedTitle, {
        description: errorMessage
    });
    
    return null;
}; 