import { BoxProps, HStack, Link, Text } from '@chakra-ui/react';
import { ORGANIZATION_URL, CO_CONTRIBUTOR, REPO_URL } from 'constants/Project';
import { useDashboard } from 'stores';
import { FC } from 'react';

export const Footer: FC<BoxProps> = (props) => {
  const { version } = useDashboard();
  return (
    <HStack w="full" position="fixed" justifyContent="center" {...props}>
      <Text
        display="inline-block"
        color="gray.500"
        fontSize="xs"
      >
        <Link color="blue.400" href={REPO_URL}>
          Marzneshin
        </Link>
        {version ? ` (v${version}), ` : ', '}
        Made by{' '}
        <Link color="blue.400" href={ORGANIZATION_URL}>
          khodedawsh
        </Link>
        {' & '}
        <Link color="blue.400" href={CO_CONTRIBUTOR}>
          mardin.cc
        </Link>
      </Text>
    </HStack>
  );
};
