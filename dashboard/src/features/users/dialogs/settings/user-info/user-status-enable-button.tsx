import { Button } from "@marzneshin/components";
import { UserType, useUserStatusEnable } from "@marzneshin/features/users";
import { LoaderIcon } from "lucide-react";
import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface UserStatusEnableButtonProps {
    user: UserType;
}

export const UserStatusEnableButton: FC<UserStatusEnableButtonProps> = ({ user }) => {
    const [userStatus, setUserStatus] = useState<boolean>(user.enabled)
    const { t } = useTranslation()
    const { mutate: userStatusEnable, isPending } = useUserStatusEnable()

    const handleUserStatusEnabledToggle = useCallback(() => {
        userStatusEnable({ user: user, enabled: !userStatus })
        setUserStatus(!userStatus)
    }, [user, userStatus, userStatusEnable]);

    const bgColor = isPending ? 'bg-muted-foreground' : (userStatus ? 'bg-red-400' : 'bg-green-400')

    return (
        <Button
            className={bgColor}
            onClick={handleUserStatusEnabledToggle}
        >
            {isPending ? <LoaderIcon className="animate-spin" /> : t(!userStatus ? 'enable' : 'disable')}
        </Button>
    )
}
