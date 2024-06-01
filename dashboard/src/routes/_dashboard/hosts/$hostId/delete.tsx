import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/hosts/$hostId/delete')({
  component: () => <div>Hello /_dashboard/hosts/$hostId/delete!</div>
})