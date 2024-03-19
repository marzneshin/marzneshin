import { Outlet, createFileRoute } from '@tanstack/react-router'

const AuthLayout = () => {
  return (
    <div className='grid grid-cols-2 w-screen h-screen'>
      <div className="w-full h-full">
        <Outlet />
      </div>
      <div className='w-full h-full bg-primary'></div>
    </div>
  )
}

export const Route = createFileRoute('/_auth')({
  component: () => <AuthLayout />,
})
