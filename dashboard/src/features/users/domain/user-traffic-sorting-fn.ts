import { UserType } from "@marzneshin/features/users";

export const userTrafficSortingFn = (userA: UserType, userB: UserType) => {
    if (userA.data_limit && userB.data_limit) {
        const rowAUsedTraffic = (userA.used_traffic / userA.data_limit) * 100
        const rowBUsedTraffic = (userB.used_traffic / userB.data_limit) * 100
        return rowAUsedTraffic > rowBUsedTraffic ? 1 : rowBUsedTraffic > rowAUsedTraffic ? -1 : 0
    } else {
        return 0
    }
}
