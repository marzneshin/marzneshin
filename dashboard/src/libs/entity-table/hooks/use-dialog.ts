
export interface UseDialogProps<T> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entity: T | null;
}

