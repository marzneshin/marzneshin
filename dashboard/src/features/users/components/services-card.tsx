
import { Label, Separator } from '@marzneshin/components';
import { ServiceType } from '@marzneshin/features/services';
import { LucideIcon, ServerIcon, UserIcon } from 'lucide-react';
import { FC } from 'react'

interface ServiceCardProps {
    service: ServiceType
}

const ServiceProperty = ({ Icon, amount }: { Icon: LucideIcon, amount: number }) => (
    <div className="flex flex-row items-center w-full">
        <Icon className="w-4 h-4 font-light" />
        {amount}
    </div>
)

export const ServiceCard: FC<ServiceCardProps> = (
    { service }
) => {
    if (service.users && service.inbounds) {
        return (
            <div className="w-full border rounded-md p-2 flex justify-between flex-row items-center">
                <Label>{service.name}</Label>
                <div className="flex flex-row items-center gap-1">
                    <ServiceProperty Icon={UserIcon} amount={service.users.length} />
                    <Separator className="w-4 rotate-[-75deg]" />
                    <ServiceProperty Icon={ServerIcon} amount={service.inbounds.length} />
                </div>
            </div>
        )
    }
};
