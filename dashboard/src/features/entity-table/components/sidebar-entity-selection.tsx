import {
    ToggleGroup, ToggleGroupItem,
    Table, TableHeader, TableRow, TableBody, TableHead,
    ScrollArea, Button,
} from "@marzneshin/components";
import { cn } from "@marzneshin/utils";
import {
    SidebarEntityCard,
} from "@marzneshin/features/entity-table/components";
import {
    useEntityTableContext,
    useSidebarEntityTableContext
} from "@marzneshin/features/entity-table/contexts";
import { useTranslation } from "react-i18next";

export const SidebarEntitySelection = () => {
    const {
        sidebarEntityId,
        sidebarEntities,
        setSidebarEntityId,
        sidebarCardProps,
    } = useSidebarEntityTableContext()
    const { table } = useEntityTableContext()

    const scrollBarHeight = table.getState().pagination.pageSize <= 10 ? "max-h-[45rem]" : "max-h-full"
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
                            {t('deselect')}
                        </Button>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <ToggleGroup
                    type="single"
                    onValueChange={(value) => setSidebarEntityId(value === "" ? undefined : value)}
                    defaultValue={String(sidebarEntityId)}
                >
                    <ScrollArea className={cn("flex flex-col justify-start p-1 gap-3 h-full", scrollBarHeight)}>
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
                    </ScrollArea>
                </ToggleGroup>
            </TableBody>
        </Table>
    )
}
