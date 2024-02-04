
import {
  Alert,
  AlertIcon,
  Flex,
  Button,
  Tooltip,
  HStack,
  Spinner,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Modal,
  VStack,
  useToast,
  ModalOverlay,
  IconButton,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { InboundType, useDashboard } from 'contexts/DashboardContext';
import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AddIcon, DeleteIcon, EditIcon } from 'components/Dialog/Icons';
import { DialogModalHeader } from 'components/Dialog/ModalHeader';
import { DialogModalFooter } from 'components/Dialog/ModalFooter';
import { getDefaultValues } from './DefaultValues';
import { schema, FormType } from './FormSchema';
import { InboundsField } from './InboundsField';
import { NameField } from './NameField';
import { Service, ServiceCreate } from 'types/Service';
import { DevTool } from '@hookform/devtools';

const formatService = (service: Service): FormType => {
  const inbounds: number[] = service.inbounds.map((inbound: number | InboundType): number => {
    return (typeof inbound !== 'number') ? inbound.id : inbound;
  });
  return {
    ...service,
    inbounds,
  };
};

export type ServiceDialogProps = {};

export const ServiceDialog: FC<ServiceDialogProps> = () => {
  const {
    editingService,
    isCreatingNewService,
    inbounds,
    onCreateService,
    editService,
    refetchInbounds,
    onEditingService,
    createService,
    onDeletingService,
  } = useDashboard();
  const isEditing = !!editingService;
  const isOpen = isCreatingNewService || isEditing;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('');
  const toast = useToast();
  const { t } = useTranslation();

  const form = useForm<FormType>({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      refetchInbounds();
    }
  }, [isOpen]);


  useEffect(() => {
    if (editingService) {
      form.reset(formatService(editingService));
    }
  }, [editingService]);

  const submit = async (values: FormType) => {
    setLoading(true);
    const methods = { edited: editService, created: createService };
    const method = isEditing ? 'edited' : 'created';
    setError(null);
    const { inbounds, name } = values;

    let body: ServiceCreate = { name, inbounds, id: editingService?.id };

    await methods[method](body)
      .then(() => {
        toast({
          title: t(
            isEditing ? 'serviceDialog.serviceEdited' : 'serviceDialog.serviceCreated',
            { name: values.name }
          ),
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 3000,
        });
        onClose();
      })
      .catch((err) => {
        if (err?.response?.status === 409 || err?.response?.status === 400)
          setError(err?.response?._data?.detail);
        if (err?.response?.status === 422) {
          Object.keys(err.response._data.detail).forEach((key) => {
            setError(err?.response._data.detail[key] as string);
            form.setError(key as 'name' | 'inbounds', { type: 'custom', message: err.response._data.detail[key], });
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onClose = () => {
    form.reset(getDefaultValues());
    onCreateService(false);
    onEditingService(null);
    setError(null);
  };

  const disabled = loading;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <FormProvider {...form} formState={form.formState}>
        <ModalContent mx="3">
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogModalHeader HeaderIcon={isEditing ? EditIcon : AddIcon} title={isEditing ? t('serviceDialog.editServiceTitle') : t('serviceDialog.createNewService')} />
            <ModalCloseButton mt={3} disabled={disabled} />
            <ModalBody>
              <VStack justifyContent="space-between">
                <Flex
                  flexDirection="column"
                  gridAutoRows="min-content"
                  w="full"
                >
                  <NameField form={form} disabled={disabled} isEditing={isEditing} t={t} />
                  <InboundsField t={t} inbounds={inbounds} form={form} />
                </Flex>
                {error && (
                  <Alert
                    status="error"
                    display={{ base: 'none', md: 'flex' }}
                  >
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
              </VStack>
              {error && (
                <Alert
                  mt="3"
                  status="error"
                  display={{ base: 'flex', md: 'none' }}
                >
                  <AlertIcon />
                  {error}
                </Alert>
              )}
            </ModalBody>
            <DialogModalFooter>
              <HStack
                justifyContent="flex-start"
                w={{
                  base: 'full',
                  sm: 'unset',
                }}
              >
                {isEditing && editingService !== null && (
                  <>
                    <Tooltip label={t('delete')} placement="top">
                      <IconButton
                        aria-label="Delete"
                        size="sm"
                        onClick={() => {
                          onDeletingService(editingService);
                          onClose();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </HStack>
              <HStack
                w="full"
                maxW={{ md: '50%', base: 'full' }}
                justify="end"
              >
                <Button
                  type="submit"
                  size="sm"
                  px="8"
                  colorScheme="primary"
                  leftIcon={loading ? <Spinner size="xs" /> : undefined}
                  disabled={false}
                >
                  {isEditing ? t('serviceDialog.editService') : t('createService')}
                </Button>
              </HStack>
            </DialogModalFooter>
          </form>
          <DevTool control={form.control} />
        </ModalContent>
      </FormProvider>
    </Modal >
  );
};
