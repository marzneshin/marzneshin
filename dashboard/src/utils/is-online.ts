import { UserType } from "@marzneshin/features/users";

export const isUserOnline = (user: UserType): boolean => {
    const dateObject = new Date(user.online_at);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - dateObject.getTime();
    return timeDifference < 3000;
};
