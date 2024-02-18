import 'react-datepicker/dist/react-datepicker.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { RouterProvider } from 'react-router-dom';
import { FC, Suspense } from 'react';
import { router } from 'pages/routes';

const App: FC = () => {
  return (
    <main>
      <Suspense>
        <RouterProvider router={router} />
      </Suspense>
    </main>
  );
}

export default App;
