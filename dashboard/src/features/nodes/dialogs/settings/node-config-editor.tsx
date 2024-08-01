import Editor from "@monaco-editor/react";
import { useTheme } from "@marzneshin/features/theme-switch";
import { useNodesSettings } from "./use-nodes-settings";
import { Button } from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import type { NodeType } from "../..";

export const NodeConfigEditor = ({
    entity,
    backend,
}: { entity: NodeType; backend: string }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const {
        payloadValidity,
        data,
        handleConfigSave,
        handleConfigChange,
        handleEditorValidation,
    } = useNodesSettings(entity, backend);

    return (
        <>
            <Editor
                height="50vh"
                className="rounded-sm border"
                defaultLanguage="json"
                theme={theme === "dark" ? "vs-dark" : "github"}
                defaultValue={JSON.stringify(data, null, "\t")}
                onChange={handleConfigChange}
                onValidate={handleEditorValidation}
            />
            <Button
                className="w-full"
                variant={!payloadValidity ? "destructive" : "default"}
                onClick={handleConfigSave}
                disabled={!payloadValidity}
            >
                {t("save")}
            </Button>
        </>
    );
};
