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
    const [logs, setLogs] = useState<string[]>([]);
    const logsDiv = useRef<HTMLDivElement | null>(null);
    const scrollShouldStayOnEnd = useRef(true);

    const updateLogs = useCallback((callback: (prevLogs: string[]) => string[]) => {
        setLogs(prevLogs => {
            const newLogs = callback(prevLogs);
            return newLogs.length > MAX_NUMBER_OF_LOGS ? newLogs.slice(-MAX_NUMBER_OF_LOGS) : newLogs;
        });
    }, []);

    const { readyState } = useWebSocket(node?.id ? getWebsocketUrl(node.id) : '', {
        onMessage: (e: any) => {
            updateLogs(prevLogs => [...prevLogs, e.data]);
        },
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 1000,
    });

    useEffect(() => {
        if (logsDiv.current && scrollShouldStayOnEnd.current) {
            logsDiv.current.scrollTop = logsDiv.current.scrollHeight;
        }
    }, [logs]);

    useEffect(() => {
        return () => {
            // Cleanup
            setLogs([]);
        };
    }, []);

    const status = getStatus(readyState.toString());

    return { status, readyState, logs, logsDiv };
};
