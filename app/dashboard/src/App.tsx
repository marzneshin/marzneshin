import { Grid, GridItem } from '@chakra-ui/react';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { pages, PageRoute } from 'constants/Pages';
import { Sidebar } from 'components/Sidebar';
import Login from 'pages/Login';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { Route, Routes } from 'react-router-dom';
import { fetchAdminLoader } from 'components/modules/Router';

function App() {
  return (
    <main >
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>

      <Grid
        h="100%"
        templateAreas={`"nav header"
                  "nav main"
                  "nav footer"`}
        gridTemplateRows={'20px 1fr 20px'}
        gridTemplateColumns={'15rem 1fr'}
      >
        <GridItem area={'header'} my="12px" mx="30px">
          <Header />
        </GridItem>
        <GridItem area={'nav'}>
          <Sidebar />
        </GridItem>
        <GridItem area={'main'}>
          <Routes>
            {pages.map((route: PageRoute) =>
              <Route {...route} errorElement={<Login />} loader={fetchAdminLoader} />

            )}
          </Routes>
        </GridItem>
        <GridItem area={'footer'}>
          <Footer />
        </GridItem>
      </Grid>
    </main>
  );
}

export default App;
