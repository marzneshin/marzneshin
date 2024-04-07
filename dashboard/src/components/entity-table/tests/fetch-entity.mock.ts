import { EntityQueryKeyType, FetchEntityReturn } from "..";
import { MockApiData, MockDataType } from "./data.mock";

export const fetchMockApi = ({ queryKey }: EntityQueryKeyType): FetchEntityReturn<MockDataType> => {
    const pageSize = queryKey[1]
    const pageIndex = queryKey[2]
    const startIndex = pageSize * pageIndex;
    const endIndex = startIndex + pageSize;
    const paginatedData = MockApiData.slice(startIndex, endIndex);
    const pages = Math.round(MockApiData.length / pageSize)

    return new Promise((resolve,) => {
        resolve({ entity: paginatedData, pageCount: pages })
    })
}
