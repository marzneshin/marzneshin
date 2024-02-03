
import {
  Alert,
  AlertIcon,
  Box,
  Collapse,
  Flex,
  Grid,
  GridItem,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Modal,
  VStack,
  useToast,
  ModalOverlay,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { InboundType, useDashboard } from 'contexts/DashboardContext';
import { FC, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  User,
  ,
} from 'types/User';
import { AddIcon, EditIcon } from 'components/Dialog/Icons';
import { DialogModalHeader } from 'components/Dialog/ModalHeader';
import { DialogModalFooter } from 'components/Dialog/ModalFooter';
import { getDefaultValues } from './DefaultValues';
import { schema, FormType } from './FormSchema';
import { InboundsField } from './InboundsField';
import { NameField } from './NameField';
import { Service, ServiceCreate } from 'types/Service';

const formatService = (service: Service): FormType => {
  const inbounds: number[] = service.inbounds.map((inbound: number | InboundType): number => {
    return (typeof inbound !== 'number') ? inbound.id : inbound;
  });
  return {
    ...service,
    inbounds,
  };
};

export type UserDialogProps = {};

export const UserDialog: FC<UserDialogProps> = () => {
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
  const { t, i18n } = useTranslation();

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
    const { services, username, ...rest } = values;

    let body: ServiceCreate = {
      ...rest,
      name,
      inbounds,
    };

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
            form.setError(
              key as 'name' | 'inbounds',
              {
                type: 'custom',
                message: err.response._data.detail[key],
              }
            );
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
            <DialogModalHeader HeaderIcon={isEditing ? EditIcon : AddIcon} title={isEditing ? t('userDialog.editServiceTitle') : t('createNewService')} />
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

            </DialogModalFooter>
          </form>
        </ModalContent>
      </FormProvider>
    </Modal >
  );
};
