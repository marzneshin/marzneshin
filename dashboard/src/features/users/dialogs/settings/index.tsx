import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@marzneshin/components"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { UserType, UsersStatus, UsersStatusBadge } from "@marzneshin/features/users"
import { CircularProgress } from "@nextui-org/progress"

interface UsersSettingsDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    entity: UserType | null
}

export const UsersSettingsDialog: FC<UsersSettingsDialogProps> = ({ onOpenChange, open, entity }) => {

    const { t } = useTranslation();

    if (entity) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="sm:min-w-full md:min-w-[700px]" >
                    <SheetHeader>
                        <SheetTitle>
                            {t('page.users.settings.title')}
                        </SheetTitle>
                    </SheetHeader>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Users Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableHead>
                                            Username
                                        </TableHead>
                                        <TableCell>
                                            {entity.username}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>
                                            Status
                                        </TableHead>
                                        <TableCell>
                                            <UsersStatusBadge status={UsersStatus[entity.status]} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>
                                            Expire Date
                                        </TableHead>
                                        <TableCell>
                                        </TableCell>
                                    </TableRow>
                                    {entity.data_limit &&
                                        <TableRow>
                                            <TableHead>
                                                Used Traffic
                                            </TableHead>
                                            <TableCell>
                                                <CircularProgress size="sm" value={entity.used_traffic / entity.data_limit * 100} />
                                            </TableCell>
                                        </TableRow>
                                    }
                                    <TableRow>
                                        <TableHead>
                                            Subscription link
                                        </TableHead>
                                        <TableCell>
                                            {entity.username}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>
                                            Note
                                        </TableHead>
                                        <TableCell>
                                            {entity.note}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Tabs defaultValue="settings">
                        <TabsList>
                            <TabsTrigger value="settings"> {t('settings')} </TabsTrigger>
                            <TabsTrigger value="services"> {t('services')} </TabsTrigger>
                        </TabsList>
                        <TabsContent value="settings">
                            Settings
                        </TabsContent>
                        <TabsContent value="services">
                            Services
                        </TabsContent>
                    </Tabs>
                </SheetContent>
            </Sheet>
        )
    }
}
