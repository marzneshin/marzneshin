import { FC, PropsWithChildren } from "react";

export const VStack: FC<PropsWithChildren> = ({ children }) => {
    return <div className="flex flex-col gap-2">{children}</div>;
};
