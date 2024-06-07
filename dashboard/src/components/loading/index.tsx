import { Loader } from 'lucide-react';

export const Loading = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
            <Loader className="animate-spin text-white size-9" />
        </div>
    </div>
);
