import { useState, useMemo } from "react";
import YAML from "yaml";
import {
    type NodeType,
    NodeBackendSettingConfigFormat,
    useNodesSettingsMutation,
    useNodesSettingsQuery,
} from "../..";

export const useNodesSettings = (entity: NodeType, backend: string) => {
    const { data } = useNodesSettingsQuery(entity, backend);
    const [config, setConfig] = useState<string>(data.config);
    const [payloadValidity, setPayloadValidity] = useState<boolean>(true);
    const mutate = useNodesSettingsMutation();
    const language = {
        [NodeBackendSettingConfigFormat.PLAIN]: "text",
        [NodeBackendSettingConfigFormat.JSON]: "json",
        [NodeBackendSettingConfigFormat.YAML]: "yaml",
    }[data.format];

    const configData = useMemo(() => {
        try {
            return {
                [NodeBackendSettingConfigFormat.PLAIN]: data.config,
                [NodeBackendSettingConfigFormat.JSON]: JSON.stringify(
                    JSON.parse(data.config),
                    null,
                    "\t",
                ),
                [NodeBackendSettingConfigFormat.YAML]: YAML.stringify(
                    YAML.parse(data.config),
                    null,
                    "\t",
                ),
            }[data.format];
        } catch {
            return data.config;
        }
    }, [data]);

    const handleEditorValidation = (markers: any[]) => {
        setPayloadValidity(!markers.length);
    };

    const handleConfigSave = () => {
        mutate.mutate({ node: entity, backend, config });
    };

    const handleConfigChange = (newConfig: string | undefined) => {
        if (newConfig) {
            try {
                const parsedConfig = {
                    [NodeBackendSettingConfigFormat.PLAIN]: newConfig,
                    [NodeBackendSettingConfigFormat.JSON]: JSON.parse(newConfig),
                    [NodeBackendSettingConfigFormat.YAML]: YAML.parse(newConfig),
                }[language];
                setConfig(parsedConfig);
            } catch (error) {
                setPayloadValidity(false);
            }
        }
    };

    return {
        payloadValidity,
        language,
        config: configData,
        handleConfigSave,
        handleConfigChange,
        handleEditorValidation,
    };
};
