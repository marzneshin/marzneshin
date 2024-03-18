import { Button } from '@marzneshin/components'
import { ThemeToggle } from '@marzneshin/features/theme-switch'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className="p-2">
            <ThemeToggle />
            <Button>Hello</Button>
        </div>
    )
}
