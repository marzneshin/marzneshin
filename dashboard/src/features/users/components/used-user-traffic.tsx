import { FC } from 'react'
import { UserType } from '@marzneshin/features/users';
import { CircularProgress } from '@nextui-org/progress';
import prettyBytes from 'pretty-bytes';


interface UserUsedTrafficProps {
    user: UserType
}

export const UserUsedTraffic: FC<UserUsedTrafficProps> = (
    { user }
) => {
    return (
        user.data_limit ? (
            <div className="flex gap-x-5 justify-start items-center">
                <CircularProgress
                    value={user.used_traffic / user.data_limit * 100}
                    size='sm'
                    showValueLabel
                />
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        {prettyBytes(user.used_traffic)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        {prettyBytes(user.data_limit)}
                    </p>
                </div>
            </div>
        ) : ("No Traffic")
    );
}
