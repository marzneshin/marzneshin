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
import { useNodes } from 'contexts/NodesContext';
import { FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DeleteIcon } from './Dialog/Icons';
import { Icon } from './Icon';

export const DeleteNodeModal: FC = () => {
  const { deleteNode, refetchNodes, deletingNode, onDeletingNode } = useNodes();
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const onClose = () => {
    onDeletingNode(undefined);
  };

  const onDelete = () => {
    if (deletingNode) {
      setLoading(true);
      deleteNode(deletingNode)
        .then(() => {
          refetchNodes();
          toast({
            title: t('deleteNode.deleteSuccess', { name: deletingNode.name }),
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
    <Modal isCentered isOpen={!!deletingNode} onClose={onClose} size="sm">
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
            {t('deleteNode.title')}
          </Text>
          {deletingNode && (
            <Text
              mt={1}
              fontSize="sm"
              _dark={{ color: 'gray.400' }}
              color="gray.600"
            >
              <Trans components={{ b: <b /> }}>
                {t('deleteNode.prompt', { name: deletingNode.name })}
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
