import { useTranslation } from 'react-i18next';
import { Badge, Separator } from '@marzneshin/common/components';

const CommandGuide = ({ command, desc }: { command: string, desc: string }) => {
    return (<div className="m-1">
        <Badge variant="disabled" className='font-mono rounded-sm p-[2px]'>
            {"{" + command + "}"}
        </Badge>{" "}
        {desc}
    </div>)
}

export function PopoverGuide() {
    const { t } = useTranslation()
    return (
        <div className="text-xs">
            <h3 className="font-bold text-[1rem] my-2">{t("page.hosts.popover-guide.desc")}</h3>
            <CommandGuide
                command="SERVER_IP"
                desc={t("page.hosts.popover-guide.currentServer")}
            />
            <Separator />
            <CommandGuide
                command="USERNAME"
                desc={t("page.hosts.popover-guide.username")}
            />
            <Separator />
            <CommandGuide
                command="DATA_USAGE"
                desc={t("page.hosts.popover-guide.dataUsage")}
            />
            <Separator />
            <CommandGuide
                command="DATA_LEFT"
                desc={t("page.hosts.popover-guide.remainingData")}
            />
            <Separator />
            <CommandGuide
                command="DATA_LIMIT"
                desc={t("page.hosts.popover-guide.dataLimit")}
            />
            <Separator />
            <CommandGuide
                command="DAYS_LEFT"
                desc={t("page.hosts.popover-guide.remainingDays")}
            />
            <Separator />
            <CommandGuide
                command="EXPIRE_DATE"
                desc={t("page.hosts.popover-guide.expireDate")}
            />
            <Separator />
            <CommandGuide
                command="JALALI_EXPIRE_DATE"
                desc={t("page.hosts.popover-guide.jalaliExpireDate")}
            />
            <Separator />
            <CommandGuide
                command="TIME_LEFT"
                desc={t("page.hosts.popover-guide.remainingTime")}
            />
            <Separator />
            <CommandGuide
                command="STATUS_EMOJI"
                desc={t("page.hosts.popover-guide.statusEmoji")}
            />
            <Separator />
            <CommandGuide
                command="PROTOCOL"
                desc={t("page.hosts.popover-guide.proxyProtocol")}
            />
            <Separator />
            <CommandGuide
                command="TRANSPORT"
                desc={t("page.hosts.popover-guide.proxyMethod")}
            />
        </div>
    )
}
