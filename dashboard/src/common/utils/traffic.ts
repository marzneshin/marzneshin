type UsageTuple = [number, number];
type MonthlyResult = {
    total: number;
    usages: UsageTuple[];
};

export function sumTraffic(usages: UsageTuple[], per: number): MonthlyResult {
    const monthlyMap = new Map<number, number>();

    for (const [timestamp, traffic] of usages) {
        const date = new Date(timestamp * 1000);
        const monthStartSec = Math.floor(date.getTime() / 1000 / per) * per;

        monthlyMap.set(monthStartSec, (monthlyMap.get(monthStartSec) ?? 0) + traffic);
    }

    const monthlyUsages: UsageTuple[] = [...monthlyMap.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([ts, sum]) => [ts, sum]);

    const total = monthlyUsages.reduce((acc, [, sum]) => acc + sum, 0);

    return { total, usages: monthlyUsages };
}