import { Suspense } from "react";
import {
    createFileRoute,
    defer,
    Await,
    useNavigate,
} from "@tanstack/react-router";
import { HostsMutationDialog } from "@marzneshin/modules/hosts";
import { fetchInbound } from "@marzneshin/modules/inbounds";
import { Loading, AlertDialog, AlertDialogContent } from "@marzneshin/common/components";

const HostCreate = () => {
    const { inboundId } = Route.useParams();
    const { inbound } = Route.useLoaderData()
    const navigate = useNavigate({ from: "/hosts/$inboundId/create" });

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={inbound}>
                {(inbound) => (
                    <HostsMutationDialog
                        entity={null}
                        protocol={inbound.protocol}
                        inboundId={Number(inboundId)}
                        onClose={() => navigate({ to: "/hosts" })}
                    />
                )}
            </Await>
        </Suspense>
    );
}

export const Route = createFileRoute('/_dashboard/hosts/$inboundId/create')({
    loader: async ({ params }) => {
        const inboundPromise = fetchInbound({
            queryKey: ["inbounds", Number.parseInt(params.inboundId)]
        });

        return {
            inbound: defer(inboundPromise)
        }
    },
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>Host not found</AlertDialogContent>
        </AlertDialog>
    ),
    component: HostCreate,
});
