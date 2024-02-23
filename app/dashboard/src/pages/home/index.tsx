
import Page from 'components/page';
import { FC } from 'react';
import { Statistics } from './statistics';
import { pages } from 'stores';

export const Home: FC = () => {
  return (
    <Page page={pages.home}>
      <Statistics mt="4" />
    </Page>
  );
};

export default Home;
