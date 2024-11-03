import { FetchEntityReturn } from "../hooks";

interface Entity {
    id: number;
    name: string;
    createdAt: string;
}

const massDataEntities = [
    { id: 1, name: "Azad Ahmed", createdAt: "2023-01-01" },
    { id: 2, name: "Bahman Karim", createdAt: "2024-02-05" },
    { id: 3, name: "Chnar Zana", createdAt: "2022-03-08" },
    { id: 4, name: "Dilshad Hassan", createdAt: "2024-04-11" },
    { id: 5, name: "Evin Rojan", createdAt: "2023-05-06" },
    { id: 6, name: "Farhad Hama", createdAt: "2025-06-08" },
    { id: 7, name: "Goran Rebwar", createdAt: "2027-07-10" },
    { id: 8, name: "Havin Ahmed", createdAt: "2025-08-09" },
    { id: 9, name: "Jiyan Qasim", createdAt: "2025-06-08" },
    { id: 10, name: "Kawa Sherwan", createdAt: "2027-07-10" },
    { id: 11, name: "Lawan Barzan", createdAt: "2025-08-09" },
    { id: 12, name: "Nazdar Rizgar", createdAt: "2025-08-09" },
    { id: 13, name: "Rojan Shamal", createdAt: "2023-09-12" },
    { id: 14, name: "Sherin Jalal", createdAt: "2024-10-23" },
    { id: 15, name: "Tahir Walat", createdAt: "2022-11-29" },
    { id: 16, name: "Viyan Bave", createdAt: "2023-12-17" },
    { id: 17, name: "Yousif Farhad", createdAt: "2025-01-05" },
    { id: 18, name: "Zahra Kamal", createdAt: "2026-02-14" },
    { id: 19, name: "Bakhtiar Shwan", createdAt: "2025-03-21" },
    { id: 20, name: "Diyar Latif", createdAt: "2026-04-13" },
    { id: 21, name: "Azad Ahmed", createdAt: "2023-01-01" },
    { id: 22, name: "Bahman Karim", createdAt: "2024-02-05" },
    { id: 23, name: "Chnar Zana", createdAt: "2022-03-08" },
    { id: 24, name: "Dilshad Hassan", createdAt: "2024-04-11" },
    { id: 25, name: "Evin Rojan", createdAt: "2023-05-06" },
    { id: 26, name: "Farhad Hama", createdAt: "2025-06-08" },
    { id: 27, name: "Goran Rebwar", createdAt: "2027-07-10" },
    { id: 28, name: "Havin Ahmed", createdAt: "2025-08-09" },
    { id: 29, name: "Jiyan Qasim", createdAt: "2025-06-08" },
    { id: 30, name: "Kawa Sherwan", createdAt: "2027-07-10" },
    { id: 31, name: "Lawan Barzan", createdAt: "2025-08-09" },
    { id: 32, name: "Nazdar Rizgar", createdAt: "2025-08-09" },
    { id: 33, name: "Rojan Shamal", createdAt: "2023-09-12" },
    { id: 34, name: "Sherin Jalal", createdAt: "2024-10-23" },
    { id: 35, name: "Tahir Walat", createdAt: "2022-11-29" },
    { id: 36, name: "Viyan Bave", createdAt: "2023-12-17" },
    { id: 37, name: "Yousif Farhad", createdAt: "2025-01-05" },
    { id: 38, name: "Zahra Kamal", createdAt: "2026-02-14" },
    { id: 39, name: "Bakhtiar Shwan", createdAt: "2025-03-21" },
    { id: 40, name: "Diyar Latif", createdAt: "2026-04-13" },
];

export const fetchEntity = async ({ queryKey }: { queryKey: any }) => {
    const [, pageIndex, pageSize, search, ,] = queryKey;

    const filteredEntities = search
        ? massDataEntities.filter(entity =>
            entity.name.toLowerCase().includes(search.toLowerCase())
        )
        : massDataEntities;

    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedEntities = filteredEntities.slice(startIndex, endIndex);

    return {
        entities: paginatedEntities,
        pageCount: Math.ceil(filteredEntities.length / pageSize),
    };
}

export const fetchEntityLoading = async (): FetchEntityReturn<Entity> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                entities: [{ id: 40, name: "Diyar Latif", createdAt: "2026-04-13" }],
                pageCount: 1,
            });
        }, 24 * 60 * 60 * 1000);
    });
}
