
import { Box, Text, Button, chakra } from '@chakra-ui/react';
import { FC } from 'react';
import { ReactComponent as AddFileIcon } from 'assets/add_file.svg';
import { t } from 'i18next';

type EmptySectionProps = {
    isFiltered: boolean;
    noObjectMatchedT: string;
    noObjectT: string;
    createObjectT: string;
    onCreateObject: (isOpen: boolean) => void;
};

const EmptySectionIcon = chakra(AddFileIcon);

/**
 * Component to provide visual feedback for the result of table filtering
 * and table emptiness
 *
 * @param noObjectMatchedT - i18n token for "No <object> where Matched"
 * @param noObjectT - i18n token for "No <object> where found"
 * @param createObjectT - i18n token for "Create <object>" Button
 * @param onCreateObject - Create object event handler on click
 *
 */
export const EmptySection: FC<EmptySectionProps> = ({ isFiltered, noObjectT, noObjectMatchedT, createObjectT, onCreateObject }) => {
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
        {isFiltered ? t(noObjectMatchedT) : t(noObjectT)}
      </Text>
      {!isFiltered && (
        <Button
          size="sm"
          colorScheme="primary"
          onClick={() => onCreateObject(true)}
        >
          {t(createObjectT)}
        </Button>
      )}
    </Box>
  );
};
