import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard')({
  component: () => <div>Hello /_dashboard!</div>
})