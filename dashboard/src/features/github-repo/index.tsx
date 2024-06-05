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
import {
    GithubIcon,
    StarIcon,
} from "lucide-react";


export const GithubRepo = (props: {}) => {
    const { data: stats } = useGithubRepoStatsQuery()
    return (
        <Button className="bg-gray-800 text-secondary dark:hover:bg-secondary-foreground dark:hover:text-secondary dark:text-secondary-foreground p-2" asChild>
            <Card>
                <CardContent className="hstack size-fit p-0 gap-2 items-center">
                    <GithubIcon className="size-fit" />
                    <div className="vstack items-start">
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
                </CardContent>
            </Card>
        </Button>
    )
}
