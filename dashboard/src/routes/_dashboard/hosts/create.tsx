import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/hosts/create')({
  component: () => <div>Hello /_dashboard/hosts/create!</div>
})