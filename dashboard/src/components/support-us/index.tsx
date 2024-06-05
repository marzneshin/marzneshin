import { HeartHandshake, Github } from 'lucide-react';
import { Button, Separator } from "@marzneshin/components";

export const SupportUs = () => {
    return (
        <div className="border-2 p-5 rounded-md font-body flex flex-col text-neutral-600 text-sm">
            <h3 className="flex flex-row gap-2 text-lg items-center font-semibold font-header text-neutral-800">
                <HeartHandshake /> Support Us
            </h3>
            Marzneshin is a free open-source software (FOSS),
            join us and show your support by donating.
            <div className="gap-1 flex flex-row items-center  space-x-4 ">
                <Button variant="link" className="p-0" size="icon" asChild>
                    <a href="https://github.com/khodedawsh/marzneshin"><Github /></a>
                </Button>
                <Separator orientation="vertical" className="bg-black" />
                <Button variant="link" className="p-0" asChild>
                    <a href="https://github.com/khodedawsh/marzneshin#donation">Donation</a>
                </Button>

            </div>
        </div>
    )
}
