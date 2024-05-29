import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import type { UserType } from "../types";

export async function fetchUser({
  queryKey,
}: { queryKey: [string, string] }): Promise<UserType> {
  return await fetch(`/users/${queryKey[1]}`).then((result) => {
    return result;
  });
}

export const UserQueryFetchKey = "users";

export const useUserQuery = ({ username }: { username: string }) => {
  return useQuery({
    queryKey: [UserQueryFetchKey, username],
    queryFn: fetchUser,
    initialData: null,
  });
};
