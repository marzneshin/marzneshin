import { useAuth } from '@marzneshin/features/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard')({
  component: () => <div>Hello /_dashboard!</div>,

  beforeLoad: async () => {
    if (!useAuth.getState().isLoggedIn) {
      throw redirect({
        to: '/login',
      })
    }
  }
})
