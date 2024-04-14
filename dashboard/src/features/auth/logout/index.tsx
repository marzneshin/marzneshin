
import { Button } from '@marzneshin/components';
import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { FC, useCallback } from 'react'

interface LogoutProps { }

export const Logout: FC<LogoutProps> = () => {
    const navigate = useNavigate({ from: '/' })
    const handleLogout = useCallback(
        () => {
            navigate({ to: '/login' })
        },
        [navigate],
    )
    return (
        <Button className="h-full" size="icon" onClick={handleLogout}>
            <LogOut className="h-[1rem] w-[1rem]" />
        </Button>
    );
}
