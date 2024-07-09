import type { FC } from "react";
import { fetchAdmins, AdminsQueryFetchKey } from "@marzneshin/features/admins";
import { columns } from "./columns";
import { EntityTable } from "@marzneshin/features/entity-table";
import { useNavigate } from "@tanstack/react-router";

export const AdminsTable: FC = () => {
    const navigate = useNavigate({ from: "/admins" });
    return (
        <EntityTable
            fetchEntity={fetchAdmins}
            manualSorting={false}
            columnsFn={columns}
            filteredColumn="username"
            entityKey={AdminsQueryFetchKey}
            onCreate={() => navigate({ to: "/admins/create" })}
            onOpen={(entity) =>
                navigate({
                    to: "/admins/$adminId",
                    params: { adminId: entity.username },
                })
            }
            onEdit={(entity) =>
                navigate({
                    to: "/admins/$adminId/edit",
                    params: { adminId: entity.username },
                })
            }
            onDelete={(entity) =>
                navigate({
                    to: "/admins/$adminId/delete",
                    params: { adminId: entity.username },
                })
            }
        />
    );
};
