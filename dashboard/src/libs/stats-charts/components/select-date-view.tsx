import type { FC, PropsWithChildren } from 'react';
import {
    RadioGroup,
    RadioGroupItem,
    Label
} from "@marzneshin/common/components";

const SelectDateViewItem: FC<PropsWithChildren & { interval: string }> = ({ interval, children }) => (
    <div className="flex gap-2 justify-center items-center relative rounded-full py-0.5 px-1 cursor-pointer">
        <RadioGroupItem
            value={interval}
            id={interval}
            className="sr-only peer"
        />
        <Label
            htmlFor={interval}
            className="dark:peer-data-[state=checked]:bg-primary-foreground  dark:peer-data-[state=checked]:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:border-1 border-0 peer-data-[state=checked]:text-primary-foreground dark:peer-data-[state=checked]:text-primary peer-data-[state=checked]:bg-primary dark:peer-data-[state=checked]:text-white text-xs rounded-full py-0.5 px-2 transition-colors"
        >
            {children}
        </Label>
    </div>
)

export const SelectDateView = (
    { timeRange, setTimeRange }: { timeRange: string, setTimeRange: (s: string) => void }
) => {
    return (
        <RadioGroup
            className="bg-muted border flex flex-row rounded-full"
            value={timeRange}
            onValueChange={setTimeRange}
        >
            <SelectDateViewItem interval="1d"> 24H</SelectDateViewItem>
            <SelectDateViewItem interval="7d"> 7D</SelectDateViewItem>
            <SelectDateViewItem interval="30d"> 30D</SelectDateViewItem>
            <SelectDateViewItem interval="90d"> 3M</SelectDateViewItem>
        </RadioGroup>
    )
};
