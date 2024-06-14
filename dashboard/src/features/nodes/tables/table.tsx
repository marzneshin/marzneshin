import { FC } from "react";
import {
    columns,
    fetchNodes,
} from '@marzneshin/features/nodes';
import { EntityTable } from "@marzneshin/features/entity-table";
import { useNavigate } from "@tanstack/react-router";

export const NodesTable: FC = () => {
    const navigate = useNavigate({ from: "/nodes" });
    return (
        <EntityTable
            fetchEntity={fetchNodes}
            columnsFn={columns}
            filteredColumn="name"
            entityKey="nodes"
            onCreate={() => navigate({ to: "/nodes/create" })}
            onOpen={(entity) =>
                navigate({
                    to: "/nodes/$nodeId",
                    params: { nodeId: String(entity.id) },
                })
            }
            onEdit={(entity) =>
                navigate({
                    to: "/nodes/$nodeId/edit",
                    params: { nodeId: String(entity.id) },
                })
            }
            onDelete={(entity) =>
                navigate({
                    to: "/nodes/$nodeId/delete",
                    params: { nodeId: String(entity.id) },
                })
            }
        />
    )
}
