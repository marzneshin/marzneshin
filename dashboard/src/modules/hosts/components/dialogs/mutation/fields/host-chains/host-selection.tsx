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
import { useHostsQuery } from "../../../../../api";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

interface Host {
    id?: number;
    remark: string;
    address: string;
    port: number | null;
}

interface HostsSelectionQueryProps {
    selectedHosts: number[];
    setSelectedHosts: (hosts: number[]) => void;
}

const HostSearchInput: FC<{
    query: string;
    onQueryChange: (query: string) => void;
}> = ({ query, onQueryChange }) => (
    <div className="vstack p-2 gap-2">
        <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search..."
        />
    </div>
);

const HostListItem: FC<{
    host: Host;
    isSelected: boolean;
    onToggleSelection: (id: number) => void;
}> = ({ host, isSelected, onToggleSelection }) => (
    <Card className="text-sm gap-3 p-2 hstack">
        <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(host.id!)}
        />
        <div className="text-sm gap-3 vstack">
            <span>{host.remark}</span>
            <Badge className="w-fit">
                {host.address}:{host.port}
            </Badge>
        </div>
    </Card>
);

export const HostsSelectionQuery: FC<HostsSelectionQueryProps> = ({
    selectedHosts,
    setSelectedHosts,
}) => {
    const [hostSearchQuery, setHostSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const { data } = useHostsQuery({
        page: 1,
        size: 100,
        filters: { remark: hostSearchQuery },
    });

    const toggleHostSelection = (hostId: number) => {
        setSelectedHosts(
            selectedHosts.includes(hostId)
                ? selectedHosts.filter((id) => id !== hostId)
                : [...selectedHosts, hostId]
        );
    };

    const applySelection = () => {
        setSelectedHosts(
            data.entities
                .filter((host) => selectedHosts.includes(host.id!))
                .map((host) => host.id!)
        );
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
                <HostSearchInput
                    query={hostSearchQuery}
                    onQueryChange={setHostSearchQuery}
                />
                <Separator className="w-full" />
                <ScrollArea className="vstack p-2 max-h-80 divide-primary gap-2">
                    {data.entities.map((host) => (
                        <HostListItem
                            key={host.id}
                            host={host}
                            isSelected={selectedHosts.includes(host.id!)}
                            onToggleSelection={toggleHostSelection}
                        />
                    ))}
                </ScrollArea>
                    <Button
                        size="sm"
                        onClick={applySelection}
                    >
                        {t("page.hosts.host-chains.apply")}
                    </Button>
 
            </PopoverContent>
        </Popover>
    );
};
