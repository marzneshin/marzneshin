
import Page from 'components/page';
import { FC } from 'react';
import { Statistics } from './statistics';

export const Home: FC = () => {
  return (
    <Page>
      <Statistics mt="4" />
    </Page>
  );
};

export default Home;
