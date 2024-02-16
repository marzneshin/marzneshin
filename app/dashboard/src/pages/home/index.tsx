
import Page from 'components/page';
import { FC } from 'react';
import { Statistics } from 'components/Statistics';

export const Home: FC = () => {
  return (
    <Page>
      <Statistics mt="4" />
    </Page>
  );
};

export default Home;
