import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/users')({
  component: () => <div>Hello /_dashboard/users!</div>
})