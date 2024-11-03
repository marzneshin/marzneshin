import { FC } from "react";
import {
    columns as columnsFn,
    fetchNodes,
    NodeType
} from '@marzneshin/modules/nodes';
import { EntityTable } from "@marzneshin/libs/entity-table";
import { useNavigate } from "@tanstack/react-router";

export const NodesTable: FC = () => {
    const navigate = useNavigate({ from: "/nodes" });

    const onOpen = (entity: NodeType) => {
        navigate({
            to: "/nodes/$nodeId",
            params: { nodeId: String(entity.id) },
        })
    }

    const onEdit = (entity: NodeType) => {
        navigate({
            to: "/nodes/$nodeId/edit",
            params: { nodeId: String(entity.id) },
        })
    }

    const onDelete = (entity: NodeType) => {
        navigate({
            to: "/nodes/$nodeId/delete",
            params: { nodeId: String(entity.id) },
        })
    }

    const columns = columnsFn({ onEdit, onDelete, onOpen });

    return (
        <EntityTable
            fetchEntity={fetchNodes}
            columns={columns}
            primaryFilter="name"
            entityKey="nodes"
            onCreate={() => navigate({ to: "/nodes/create" })}
            onOpen={onOpen}
        />
    )
}
