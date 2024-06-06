import {
    Card,
    CardTitle,
    CardContent,
    CardDescription,
    Button,
} from "@marzneshin/components"
import {
    useGithubRepoStatsQuery
} from "./services";
import { type FC } from "react";
import {
    GithubIcon,
    StarIcon,
} from "lucide-react";

interface GithubRepoProps {
    variant?: "full" | "mini"
}

export const GithubRepo: FC<GithubRepoProps> = ({ variant = "full" }) => {
    const { data: stats } = useGithubRepoStatsQuery()
    return (
        <Button variant="secondary" className="bg-gray-800 border-0 dark:text-primary text-secondary dark:hover:text-secondary dark:hover:bg-primary hover:bg-secondary hover:text-primary p-2" asChild>
            <Card>
                <CardContent className="hstack size-fit p-0 gap-2 items-center">
                    <GithubIcon className="size-fit" />
                    {variant === "full" ? (<div className="vstack items-start">
                        <CardTitle className="font-mono text-xs hstack justify-between w-full">
                            {stats.full_name}
                            <div className="hstack gap-1 font-bold items-center text-xs">
                                <StarIcon className="size-3" />
                                {stats.stargazers_count}
                            </div>
                        </CardTitle>
                        <CardDescription className="text-xs">
                            {stats.description}
                        </CardDescription>
                    </div>
                    ) : (
                        <CardDescription className="hstack gap-1 font-bold items-center text-xs">
                            <StarIcon className="size-3" />
                            {stats.stargazers_count}
                        </CardDescription>
                    )}
                </CardContent>
            </Card>
        </Button>
    )
}
