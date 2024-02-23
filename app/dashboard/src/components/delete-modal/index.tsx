

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DeleteIcon } from 'components/dialog';
import { Icon } from 'components/icon';

type DeleteModalProps = {
  onDelete: () => void,
  deleteObjectPromptT: string,
  deleteObjectTitleT: string,
  deletingObjectName?: string,
  isOpen: boolean,
  onClose: () => void,
  loading: boolean,
}

export const DeleteModal: FC<DeleteModalProps> = ({
  onDelete,
  isOpen,
  onClose,
  deletingObjectName,
  loading,
  deleteObjectTitleT,
  deleteObjectPromptT
}) => {
  const { t } = useTranslation();

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent mx="3">
        <ModalHeader pt={6}>
          <Icon color="red">
            <DeleteIcon />
          </Icon>
        </ModalHeader>
        <ModalCloseButton mt={3} />
        <ModalBody>
          <Text fontWeight="semibold" fontSize="lg">
            {t(deleteObjectTitleT)}
          </Text>
          {deletingObjectName && (
            <Text
              mt={1}
              fontSize="sm"
              _dark={{ color: 'gray.400' }}
              color="gray.600"
            >
              <Trans components={{ b: <b /> }}>
                {t(deleteObjectPromptT, { name: deletingObjectName })}
              </Trans>
            </Text>
          )}
        </ModalBody>
        <ModalFooter display="flex">
          <Button size="sm" onClick={onClose} mr={3} w="full" variant="outline">
            {t('cancel')}
          </Button>
          <Button
            size="sm"
            w="full"
            colorScheme="red"
            onClick={() => onDelete()}
            leftIcon={loading ? <Spinner size="xs" /> : undefined}
          >
            {t('delete')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
