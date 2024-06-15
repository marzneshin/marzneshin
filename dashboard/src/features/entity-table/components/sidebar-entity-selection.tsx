import {
    ToggleGroup, ToggleGroupItem,
    Table, TableHeader, TableRow, TableBody, TableHead,
    ScrollArea, Button,
} from "@marzneshin/components";
import {
    SidebarEntityCard,
} from "@marzneshin/features/entity-table/components";
import {
    useSidebarEntityTableContext
} from "@marzneshin/features/entity-table/contexts";
import { useTranslation } from "react-i18next";

export const SidebarEntitySelection = () => {
    const {
        sidebarEntityId,
        sidebarEntities,
        setSidebarEntityId,
        sidebarCardProps
    } = useSidebarEntityTableContext()
    const { t } = useTranslation();

    return (
        <Table className="w-full">
            <TableHeader>
                <TableRow>
                    <TableHead className="hstack justify-between items-center">
                        {t("inbounds")}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onMouseDown={() => setSidebarEntityId(undefined)}
                        >
                            Unselect
                        </Button>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <ScrollArea className="w-full h-full p-2">
                    <ToggleGroup
                        type="single"
                        onValueChange={setSidebarEntityId}
                        defaultValue={String(sidebarEntityId)}
                    >
                        <div className="flex flex-col w-full gap-2">
                            {sidebarEntities.map((entity: any) => (
                                <ToggleGroupItem
                                    className="px-0 w-full h-full"
                                    value={String(entity.id)}
                                    key={String(entity.id)}
                                    id={String(entity.id)}>
                                    <SidebarEntityCard
                                        {...sidebarCardProps}
                                        entity={entity}
                                        checked={sidebarEntityId === String(entity.id)}
                                    />
                                </ToggleGroupItem>
                            ))}
                        </div>
                    </ToggleGroup>
                </ScrollArea>
            </TableBody>
        </Table>
    )
}
