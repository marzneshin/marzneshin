import { createContext, useContext } from "react";
import { NodeType } from "@marzneshin/features/nodes";

interface RouterNodeContextProps {
    node: NodeType;
}

export const RouterNodeContext = createContext<RouterNodeContextProps | null>(null);

export const useRouterNodeContext = () => {
    const ctx = useContext(RouterNodeContext);
    return ctx;
};
