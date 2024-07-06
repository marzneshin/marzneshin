import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_dashboard/admins')({
  component: () => <div>Hello /_dashboard/admins!</div>
})