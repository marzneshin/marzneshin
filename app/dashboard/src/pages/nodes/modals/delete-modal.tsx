import {
  useToast,
} from '@chakra-ui/react';
import { useNodes } from 'stores';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteModal } from 'components/delete-modal';

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
    <DeleteModal
      onDelete={onDelete}
      loading={loading}
      isOpen={!!deletingNode}
      onClose={onClose}
      deletingObjectName={deletingNode?.name}
      deleteObjectTitleT={'deleteNode.title'}
      deleteObjectPromptT={'deleteNode.prompt'}
    />
  );
};
