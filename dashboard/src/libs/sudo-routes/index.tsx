import { useAuth } from "@marzneshin/modules/auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect , PropsWithChildren, FC} from "react";

export const SudoRoute: FC<PropsWithChildren> = ({ children }) => {
    const { isSudo, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAccess = async () => {
            const loggedIn = await isLoggedIn();
            if (!loggedIn || !isSudo()) {
                navigate({ to: '/login' });
            }
        };

        checkAccess();
    }, [isSudo, isLoggedIn, navigate]);

    if (!isSudo) {
        return null; 
    }

    return children;
};

