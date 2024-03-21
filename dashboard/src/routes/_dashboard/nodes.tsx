import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/nodes')({
  component: () => <div>Hello /_dashboard/nodes!</div>
})