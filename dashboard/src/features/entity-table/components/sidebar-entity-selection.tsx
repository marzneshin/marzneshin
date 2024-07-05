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
                <ToggleGroup
                    type="single"
                    onValueChange={(value) => setSidebarEntityId(value === "" ? undefined : value)}
                    defaultValue={String(sidebarEntityId)}
                >
                    <ScrollArea className="flex flex-col justify-start p-1 gap-3 h-full max-h-[20rem]">
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
