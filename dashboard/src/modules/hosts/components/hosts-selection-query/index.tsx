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
import { useHostsQuery } from "../../api";
import { FC, useEffect, useState } from "react";

interface HostsSelectionQueryProps {
    selectedHosts: object;
    setSelectedHosts: (hosts: object) => void;
}

export const HostsSelectionQuery: FC<HostsSelectionQueryProps> = ({
    selectedHosts,
    setSelectedHosts,
}) => {
    const [hostSearchQuery, setHostSearchQuery] = useState<string>("");

    const { data } = useHostsQuery({
        page: 1,
        size: 100,
        filters: { remark: hostSearchQuery },
    });

    useEffect(() => {
        console.log(selectedHosts);
    }, [selectedHosts]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <PlusIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="vstack p-0 gap-2">
                <div className="vstack p-2 gap-2">
                    <Input
                        defaultValue={hostSearchQuery}
                        onChange={(e) => setHostSearchQuery(e.target.value)}
                        placeholder="Search..."
                        value={hostSearchQuery}
                    />
                </div>
                <Separator className="w-full" />
                <ScrollArea className="vstack p-2  max-h-80  divide-primary gap-2">
                    {data.entities.map((host) => (
                        <Card className="text-sm gap-3 p-2 hstack">
                            <Checkbox
                                checked={selectedHosts[host.id!] ?? false}
                                onCheckedChange={(checked) =>
                                    checked
                                        ? setSelectedHosts([
                                              ...selectedHosts.keys(),
                                              host.id!,
                                          ])
                                        : setSelectedHosts(
                                              selectedHosts.filter(
                                                  (value: number) =>
                                                      value !== host.id,
                                              ),
                                          )
                                }
                            />
                            <div className="text-sm gap-3 vstack">
                                <span>{host.remark}</span>
                                <Badge className="w-fit">
                                    {host.address}:{host.port}
                                </Badge>
                            </div>
                        </Card>
                    ))}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};
