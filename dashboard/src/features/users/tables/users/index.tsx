import type { FC } from "react";
import { fetchUsers, UsersQueryFetchKey } from "@marzneshin/features/users";
import { columns } from "./columns";
import { EntityTable } from "@marzneshin/components";
import { useNavigate } from "@tanstack/react-router";

export const UsersTable: FC = () => {
    const navigate = useNavigate({ from: "/users" });
    return (
        <EntityTable
            fetchEntity={fetchUsers}
            manualSorting={true}
            columnsFn={columns}
            filteredColumn="username"
            entityKey={UsersQueryFetchKey}
            onCreate={() => navigate({ to: "/users/create" })}
            onOpen={(entity) =>
                navigate({
                    to: "/users/$userId",
                    params: { userId: entity.username },
                })
            }
            onEdit={(entity) =>
                navigate({
                    to: "/users/$userId/edit",
                    params: { userId: entity.username },
                })
            }
            onDelete={(entity) =>
                navigate({
                    to: "/users/$userId/delete",
                    params: { userId: entity.username },
                })
            }
        />
    );
};
