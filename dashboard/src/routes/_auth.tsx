import { Outlet, createFileRoute } from '@tanstack/react-router'
import network from '@marzneshin/assets/undraw_connected_world_wuay.svg'

const AuthLayout = () => {
  return (
    <div className='grid-cols-2 w-screen h-screen md:grid bg-primary md:bg-primary-foreground'>
      <div className="w-full h-full">
        <Outlet />
      </div>
      <div className='hidden justify-center items-center w-full h-full md:flex bg-primary dark:bg-accent'>
        <img src={network} className="w-1/2 h-1/2" />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_auth')({
  component: () => <AuthLayout />,
})
