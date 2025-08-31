import {
    PopoverTrigger,
    Popover,
    Button,
    PopoverContent,
    Separator,
    Input,
    ScrollArea,
    Card,
    Checkbox,
    Badge,
} from "@marzneshin/common/components";
import { PlusIcon } from "lucide-react";
import { useHostsQuery } from "@marzneshin/modules/hosts/api";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { HostType } from "@marzneshin/modules/hosts/domain";
import { ChainedHostsStore, useChainedHostsStore } from "./store";
import { useFormContext } from "react-hook-form";

const HostListItem: FC<{
    host: HostType;
    isSelected: boolean;
    onToggleSelection: (host: HostType) => void;
}> = ({ host, isSelected, onToggleSelection }) => (
    <Card className=" gap-3 p-2 hstack">
        <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(host)}
        />
        <div className="gap-3 vstack">
            <span className="text-sm">{host.remark}</span>
            <Badge className="w-fit">
                {host.address}:{host.port}
            </Badge>
        </div>
    </Card>
);

export const HostsSelectionQuery: FC = () => {
    const { selectedHosts, addHost, removeHost } = useChainedHostsStore(
        (state: ChainedHostsStore) => ({
            selectedHosts: state.selectedHosts,
            fieldsArray: state.fieldsArray,
            addHost: state.addHost,
            removeHost: state.removeHost,
        }),
    );
    const form = useFormContext();
    const [hostSearchQuery, setHostSearchQuery] = useState("");
    const selectedHostIds = form.watch("chain_ids")?.map((hostId: number) => hostId)
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const { data } = useHostsQuery({
        page: 1,
        size: 100,
        filters: { remark: hostSearchQuery },
    });

    const toggleHostSelection = (host: HostType) => {
        const exist = selectedHosts.find((hostData) => hostData.id === host.id);
        if (!exist) addHost(host);
        else if (exist && host.id) removeHost(host.id);
    };

    const applySelection = () => {
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <PlusIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="vstack p-0 gap-2">
                <div className="hstack p-2 gap-2 items-center">
                    <Input
                        value={hostSearchQuery}
                        onChange={(e) => setHostSearchQuery(e.target.value)}
                        placeholder="Search..."
                    />
                    <Button
                        size="sm"
                        className="w-1/4"
                        onClick={applySelection}
                    >
                        {t("page.hosts.host-chains.apply")}
                    </Button>
                </div>
                <Separator className="w-full" />
                <ScrollArea className="vstack p-2 max-h-80 divide-primary gap-2">
                    {data.entities.map((host) => (
                        <HostListItem
                            key={host.id}
                            host={host}
                            isSelected={selectedHostIds.includes(host.id)}
                            onToggleSelection={toggleHostSelection}
                        />
                    ))}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};
