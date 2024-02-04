import { Box, Text, Button, chakra } from '@chakra-ui/react';
import { useDashboard } from 'contexts/DashboardContext';
import { FC } from 'react';
import { ReactComponent as AddFileIcon } from 'assets/add_file.svg';
import { useTranslation } from 'react-i18next';

type EmptySectionProps = {
    isFiltered: boolean;
};

const EmptySectionIcon = chakra(AddFileIcon);

export const EmptySection: FC<EmptySectionProps> = ({ isFiltered }) => {
  const { onCreateUser } = useDashboard();
  const { t } = useTranslation();
  return (
    <Box
      padding="5"
      py="8"
      display="flex"
      alignItems="center"
      flexDirection="column"
      gap={4}
      w="full"
    >
      <EmptySectionIcon
        maxHeight="200px"
        maxWidth="200px"
        _dark={{
          'path[fill="#fff"]': {
            fill: 'gray.800',
          },
          'path[fill="#f2f2f2"], path[fill="#e6e6e6"], path[fill="#ccc"]': {
            fill: 'gray.700',
          },
          'circle[fill="#3182CE"]': {
            fill: 'primary.300',
          },
        }}
        _light={{
          'path[fill="#f2f2f2"], path[fill="#e6e6e6"], path[fill="#ccc"]': {
            fill: 'gray.300',
          },
          'circle[fill="#3182CE"]': {
            fill: 'primary.500',
          },
        }}
      />
      <Text fontWeight="medium" color="gray.600" _dark={{ color: 'gray.400' }}>
        {isFiltered ? t('usersTable.noUserMatched') : t('usersTable.noUser')}
      </Text>
      {!isFiltered && (
        <Button
          size="sm"
          colorScheme="primary"
          onClick={() => onCreateUser(true)}
        >
          {t('createUser')}
        </Button>
      )}
    </Box>
  );
};
