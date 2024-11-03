import { Button } from "@marzneshin/common/components";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { FC, useCallback } from "react";

interface LogoutProps { }

export const Logout: FC<LogoutProps> = () => {
    const navigate = useNavigate({ from: "/" });
    const handleLogout = useCallback(() => {
        navigate({ to: "/login" });
    }, [navigate]);
    return (
        <Button
            size="sm"
            variant="ghost"
            onClick={handleLogout}
            className="hstack gap-1 items-center justify-between w-full h-fit p-0"
        >
            Logout
            <LogOut className="size-4" />
        </Button>
    );
};
