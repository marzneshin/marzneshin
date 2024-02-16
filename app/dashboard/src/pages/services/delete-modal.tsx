import {
  useToast,
} from '@chakra-ui/react';
import { useServices } from 'contexts/ServicesContext';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteModal } from './delete-modal';

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
    <DeleteModal
      deleteObjectTitleT={'deleteService.title'}
      deleteObjectPromptT={'deleteService.prompt'}
      onDelete={onDelete}
      loading={loading}
      isOpen={!!deletingService}
      onClose={onClose}
      deletingObjectName={deletingService?.name}
    />
  );
};
