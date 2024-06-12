import packageJson from '@marzneshin/../package.json' assert { type: 'json' };

export const DashboardFooter = () => {
    return (
        <div className="size-full flex justify-center items-center dark:text-neutral-300 text-neutral-800">
            v{packageJson.version} Marzneshin
        </div>
    )
}
