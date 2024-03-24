import { NodeType } from "@marzneshin/features/nodes";
import { debounce } from 'lodash';
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useAuth } from "@marzneshin/features/auth";
import { joinPaths } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

export const MAX_NUMBER_OF_LOGS = 500

export const getStatus = (status: string) => {
    return {
        [ReadyState.CONNECTING]: 'connecting',
        [ReadyState.OPEN]: 'connected',
        [ReadyState.CLOSING]: 'closed',
        [ReadyState.CLOSED]: 'closed',
        [ReadyState.UNINSTANTIATED]: 'closed',
    }[status];
};

export const getWebsocketUrl = (nodeId: number) => {
    try {
        const baseURL = new URL(
            import.meta.env.VITE_BASE_API.startsWith('/')
                ? window.location.origin + import.meta.env.VITE_BASE_API
                : import.meta.env.VITE_BASE_API
        );

        return (
            (baseURL.protocol === 'https:' ? 'wss://' : 'ws://') +
            joinPaths([baseURL.host + baseURL.pathname, `/nodes/${nodeId}/logs`]) +
            '?interval=1&token=' +
            useAuth.getState().getAuthToken()
        );
    } catch (e) {
        console.error('Unable to generate websocket url');
        console.error(e);
        return null;
    }
};

export const useNodesLog = (node: NodeType) => {
    let logsTmp: string[] = [];
    const logsDiv = useRef<HTMLDivElement | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const scrollShouldStayOnEnd = useRef(true);
    const updateLogs = useCallback(
        debounce((logs: string[]) => {
            const isScrollOnEnd =
                Math.abs(
                    (logsDiv.current?.scrollTop || 0) -
                    (logsDiv.current?.scrollHeight || 0) +
                    (logsDiv.current?.offsetHeight || 0)
                ) < 10;
            if (logsDiv.current && isScrollOnEnd)
                scrollShouldStayOnEnd.current = true;
            else scrollShouldStayOnEnd.current = false;
            if (logs.length < 40) setLogs(logs);
        }, 300),
        []
    );

    const { readyState } = useWebSocket(node?.id ? getWebsocketUrl(node.id) : '', {
        onMessage: (e: any) => {
            logsTmp.push(e.data);
            if (logsTmp.length > MAX_NUMBER_OF_LOGS)
                logsTmp = logsTmp.splice(0, logsTmp.length - MAX_NUMBER_OF_LOGS);
            updateLogs([...logsTmp]);
        },
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 1000,
    });

    useEffect(() => {
        if (logsDiv.current && scrollShouldStayOnEnd.current)
            logsDiv.current.scrollTop = logsDiv.current?.scrollHeight;
    }, [logs]);

    useEffect(() => {
        return () => {
            logsTmp = [];
        };
    }, []);

    const status = getStatus(readyState.toString());
    return { status, readyState, logs, logsDiv }
}
