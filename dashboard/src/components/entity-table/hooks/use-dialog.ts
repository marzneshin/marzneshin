import { useState } from "react";

export interface UseDialogProps<T> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entity: T | null;
}

export const useDialog = () => useState<boolean>(false)
