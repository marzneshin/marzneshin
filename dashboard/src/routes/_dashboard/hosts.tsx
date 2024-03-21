import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/hosts')({
  component: () => <div>Hello /_dashboard/hosts!</div>
})