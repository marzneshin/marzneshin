import { FC } from 'react'
import { UserType } from '@marzneshin/features/users';
import { CircularProgress } from '@nextui-org/progress';
import prettyBytes from 'pretty-bytes';
import { useTranslation } from 'react-i18next';


interface UserUsedTrafficProps {
    user: UserType
}

export const UserUsedTraffic: FC<UserUsedTrafficProps> = (
    { user }
) => {
    const { t } = useTranslation()
    return (
        <div className="flex gap-x-5 justify-start items-center">
            <CircularProgress
                value={user.data_limit ? (user.used_traffic / user.data_limit * 100) : 0}
                size='sm'
                showValueLabel
            />
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    {prettyBytes(user.used_traffic)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                    {user.data_limit ? prettyBytes(user.data_limit) : t('page.users.unlimited')}
                </p>
            </div>
        </div>
    );
}
