import { UserType } from "@marzneshin/features/users";

/**
 * Check whether the user has been online or not
 *
 * @param user - User entity
 * @returns Whether the user has be online or not
 */
export const isUserOnline = (user: UserType): boolean => {
    const dateObject = new Date(user.online_at);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - dateObject.getTime();
    return timeDifference < 30000;
};
