import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/services')({
  component: () => <div>Hello /_dashboard/services!</div>
})
