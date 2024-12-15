import { useQuery } from "@tanstack/react-query";
import { projectInfo } from "@marzneshin/common/utils";
import { ofetch } from "ofetch";

/**
 * GithubRepoStatsResponse
 *
 * Github API repo statistics response
 *
 * @param full_name Full name of the repo (author/repo-name)
 * @param description Github repo description
 * @param stargazers_count Github repo star count
 */
export interface GithubRepoStatsResponse {
    full_name: string;
    description: string;
    stargazers_count: number;
}

export const GithubRepoStatsResponseDefault: GithubRepoStatsResponse = {
    full_name: projectInfo.repo,
    description: "A fork of Marzban aiming for scalability",
    stargazers_count: 0,
}

export async function fetchGithubRepoStats(): Promise<GithubRepoStatsResponse> {
    return await ofetch(`https://api.github.com/repos/${projectInfo.repo}`, { parseResponse: JSON.parse }).then((result) => {
        return result;
    });
}


export const useGithubRepoStatsQuery = () => {
    return useQuery({
        queryKey: ["github", projectInfo.repo, "stats"],
        queryFn: fetchGithubRepoStats,
        refetchInterval: 1000 * 60 * 5, // 5min refresh
        initialData: GithubRepoStatsResponseDefault
    })
}
