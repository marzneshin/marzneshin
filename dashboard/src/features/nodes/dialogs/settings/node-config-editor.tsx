
import Editor from '@monaco-editor/react';
import { useTheme } from "@marzneshin/features/theme-switch";
import { useNodesSettings } from "./use-nodes-settings";
import { Button } from '@marzneshin/components';
import { useTranslation } from 'react-i18next';
import { NodeType } from '../..';

export const NodeConfigEditor = ({ entity }: { entity: NodeType }) => {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const {
        payloadValidity,
        data,
        handleConfigSave,
        handleConfigChange,
        handleEditorValidation
    } = useNodesSettings(entity)

    return (<>
        <Editor
            height="50vh"
            className="rounded-sm border"
            defaultLanguage="json"
            theme={theme === "dark" ? "vs-dark" : "github"}
            defaultValue={JSON.stringify(data, null, '\t')}
            onChange={handleConfigChange}
            onValidate={handleEditorValidation}

        />
        <Button
            className="w-full"
            variant={!payloadValidity ? "destructive" : "default"}
            onClick={handleConfigSave}
            disabled={!payloadValidity}
        >
            {t('save')}
        </Button>
    </>
    )
}
