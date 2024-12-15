import { type FC } from "react";

interface AwaitingProps {
  isFetching?: boolean;
  isNotFound?: boolean;
  NotFound?: JSX.Element;
  Skeleton?: JSX.Element;
  Component: JSX.Element;
}

/**
 * @param isFetching - returned from react-query
 * which indicate the promise is still fetching.
 * @example
 * const { data, isFetching} = useQuery();
 *
 * @param isNotFound - whether the data return is empty or not
 * @param NotFound - Not found component
 * @param Component - The actual component itself
 * @param Skeleton - Skeleton structure which will be presented
 * when the data is still pending and fetching
 *
 */
export const Awaiting: FC<AwaitingProps> = ({
  isFetching,
  isNotFound,
  NotFound,
  Skeleton,
  Component,
}) => {
  if (isFetching) {
    return Skeleton;
  }
  if (isNotFound) {
    return NotFound;
  }
  return Component;
};
