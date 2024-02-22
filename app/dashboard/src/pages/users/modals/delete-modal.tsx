import {
  useToast,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers } from 'stores';
import { DeleteModal } from 'components/delete-modal';

type DeleteUserModalProps = {
  deleteCallback?: () => void;
};

export const DeleteUserModal: FC<DeleteUserModalProps> = () => {
  const [loading, setLoading] = useState(false);
  const { deletingUser, onDeletingUser, deleteUser } = useUsers();
  const { t } = useTranslation();
  const toast = useToast();
  const onClose = () => {
    onDeletingUser(null);
  };
  const onDelete = () => {
    if (deletingUser) {
      setLoading(true);
      deleteUser(deletingUser)
        .then(() => {
          toast({
            title: t('deleteUser.deleteSuccess', { username: deletingUser.username }),
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
      isOpen={!!deletingUser}
      onClose={onClose}
      deletingObjectName={deletingUser?.username}
      deleteObjectPromptT={'deleteUser.prompt'}
      deleteObjectTitleT={'deleteUser.title'}
    />
  );
};
