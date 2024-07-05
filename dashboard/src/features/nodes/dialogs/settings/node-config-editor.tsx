import { useNodesSettings } from "./use-nodes-settings";
import { Button, JsonEditor } from '@marzneshin/components';
import { useTranslation } from 'react-i18next';
import { NodeType } from '../..';

export const NodeConfigEditor = ({ entity }: { entity: NodeType }) => {
    const { t } = useTranslation()
    const {
        payloadValidity,
        data,
        handleConfigSave,
        handleConfigChange,
    } = useNodesSettings(entity)

    return (<>
        <JsonEditor json={data} onChange={handleConfigChange} />
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
