import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@marzneshin/components";
import { useTranslation } from 'react-i18next';

export const SelectDateView = (
    { timeRange, setTimeRange }: { timeRange: string, setTimeRange: (s: string) => void }
) => {
    const { t } = useTranslation();

    return (
        <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Select a value"
            >
                <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                    {t('page.users.settings.nodes-usage.last-months', { count: 3 })}
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                    {t('page.users.settings.nodes-usage.last-days', { count: 30 })}
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                    {t('page.users.settings.nodes-usage.last-days', { count: 7 })}
                </SelectItem>
            </SelectContent>
        </Select>
    )
};

