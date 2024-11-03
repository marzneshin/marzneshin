
export interface ColumnActions<T> {
    onDelete: (entity: T) => void;
    onOpen: (entity: T) => void;
    onEdit: (entity: T) => void;
}
