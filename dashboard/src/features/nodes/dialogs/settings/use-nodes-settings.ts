import { useState } from "react";
import { NodeType, useNodesSettingsMutation, useNodesSettingsQuery } from "../..";

export const useNodesSettings = (entity: NodeType) => {
    const { data } = useNodesSettingsQuery(entity);
    const [config, setConfig] = useState<any>(data)
    const [payloadValidity, setPayloadValidity] = useState<boolean>(true)
    const mutate = useNodesSettingsMutation();

    const handleEditorValidation = (markers: any[]) => {
        setPayloadValidity(!markers.length)
    }

    const handleConfigSave = () => {
        mutate.mutate({ node: entity, config })
    }

    const handleConfigChange = (newConfig: string | undefined) => {
        if (newConfig) {
            try {
                const parsedConfig = JSON.parse(newConfig);
                setConfig(parsedConfig);
            } catch (error) {
                setPayloadValidity(false)
            }
        }
    };

    return { payloadValidity, data, handleConfigSave, handleConfigChange, handleEditorValidation }
}
