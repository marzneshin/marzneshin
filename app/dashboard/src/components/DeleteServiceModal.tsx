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
  useToast,
} from '@chakra-ui/react';
import { useServices } from 'contexts/ServicesContext';
import { FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DeleteIcon } from './Dialog/Icons';
import { Icon } from './Icon';

export const DeleteServiceModal: FC = () => {
  const { deleteService, refetchServices, deletingService, onDeletingService } = useServices();
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const onClose = () => {
    onDeletingService(null);
  };

  const onDelete = () => {
    if (deletingService) {
      setLoading(true);
      deleteService(deletingService)
        .then(() => {
          refetchServices();
          toast({
            title: t('deleteService.deleteSuccess', { name: deletingService.name }),
            status: 'success',
            isClosable: true,
            position: 'top',
            duration: 3000,
          });
        })
        .then(onClose)
        .finally(setLoading.bind(null, false));
    }
  };

  return (
    <Modal isCentered isOpen={!!deletingService} onClose={onClose} size="sm">
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
            {t('deleteService.title')}
          </Text>
          {deletingService && (
            <Text
              mt={1}
              fontSize="sm"
              _dark={{ color: 'gray.400' }}
              color="gray.600"
            >
              <Trans components={{ b: <b /> }}>
                {t('deleteService.prompt', { name: deletingService.name })}
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
