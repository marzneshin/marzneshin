import { useState } from "react";
import {
    type NodeType,
    useNodesSettingsMutation,
    useNodesSettingsQuery,
} from "../..";

export const useNodesSettings = (entity: NodeType, backend: string) => {
    const { data } = useNodesSettingsQuery(entity, backend);
    const [config, setConfig] = useState<string>(data);
    const [payloadValidity, setPayloadValidity] = useState<boolean>(true);
    const mutate = useNodesSettingsMutation();

    const handleEditorValidation = (markers: string[]) => {
        setPayloadValidity(!markers.length);
    };

    const handleConfigSave = () => {
        mutate.mutate({ node: entity, config });
    };

    const handleConfigChange = (newConfig: string | undefined) => {
        if (newConfig) {
            try {
                const parsedConfig = JSON.parse(newConfig);
                setConfig(parsedConfig);
            } catch (error) {
                setPayloadValidity(false);
            }
        }
    };

    return {
        payloadValidity,
        data,
        handleConfigSave,
        handleConfigChange,
        handleEditorValidation,
    };
};
