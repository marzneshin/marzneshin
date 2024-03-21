import { Outlet, createFileRoute } from '@tanstack/react-router'

const AuthLayout = () => {
  return (
    <div className='grid-cols-2 w-screen h-screen md:grid bg-primary md:bg-primary-foreground'>
      <div className="w-full h-full">
        <Outlet />
      </div>
      <div className='hidden w-full h-full md:block bg-primary dark:bg-accent'></div>
    </div>
  )
}

export const Route = createFileRoute('/_auth')({
  component: () => <AuthLayout />,
})
