import {
  Box,
  Button,
  chakra,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Switch,
  Tooltip,
  useToast,
  VStack, IconButton, Spacer
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getNodeCreateDefaultValues,
  NodeCreate,
  NodeCreateSchema,
  useNodes,
} from 'stores';
import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { DeleteIcon, AddIcon, EditIcon } from 'components/dialog/Icons';
import { Input } from 'components/Input';
import { DialogModalHeader } from 'components/dialog/ModalHeader';

const CustomInput = chakra(Input, {
  baseStyle: {
    bg: 'white',
    _dark: {
      bg: 'gray.700',
    },
  },
});

export const NodesDialog: FC = () => {
  const { editingNode, isEditingNode, onEditingNode, isAddingNode, refetchNodes, updateNode, addNode, onAddingNode, onDeletingNode } = useNodes();
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>('');

  const { t } = useTranslation();
  const toast = useToast();
  const defaultValueNode: NodeCreate = (isEditingNode === true && editingNode !== null && editingNode !== undefined) ? editingNode : getNodeCreateDefaultValues();
  const form = useForm<NodeCreate>({
    resolver: zodResolver(NodeCreateSchema),
    defaultValues: defaultValueNode,
  });
  const isOpen = isEditingNode || isAddingNode;
  const onClose = () => {
    onAddingNode(false);
    onEditingNode(undefined);
  };
  useEffect(() => {
    if (isOpen) {
      refetchNodes();
      form.reset(defaultValueNode);
    }
  }, [isOpen]);

  const submit = async (values: NodeCreate) => {
    setLoading(true);
    const methods = { edited: updateNode, created: addNode };
    const method = isEditingNode ? 'edited' : 'created';
    const { name, port, id, address, usage_coefficient } = values;
    setError(null);
    let body: NodeCreate = {
      id,
      name,
      address,
      port,
      status: values.status,
      usage_coefficient,
      add_as_new_host: values.add_as_new_host,
    };

    await methods[method](body)
      .then(() => {
        toast({
          title: t(
            isEditingNode ? 'nodeDialog.editNode' : 'nodeDialog.createNewNode',
            { name: values.name }
          ),
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 3000,
        });
        refetchNodes();
        onClose();
      })
      .catch((err) => {
        if (err?.response?.status === 409 || err?.response?.status === 400)
          setError(err?.response?._data?.detail);
        if (err?.response?.status === 422) {
          Object.keys(err.response._data.detail).forEach((key) => {
            setError(err?.response._data.detail[key] as string);
            form.setError(
              key as 'address' | 'port' | 'name' | 'status',
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent mx="3" w="fit-content" maxW="3xl">
          <DialogModalHeader HeaderIcon={isEditingNode ? EditIcon : AddIcon} title={isEditingNode ? t('nodeDialog.editNode') : t('nodeDialog.addNode')} />
          <ModalCloseButton mt={3} />
          <ModalBody w="440px" pb={6} pt={3}>
            <VStack>
              {loading && 'loading...'}

              <form onSubmit={form.handleSubmit((v) => submit(v))}>
                <VStack>
                  <HStack w="full">
                    <FormControl>
                      <CustomInput
                        label={t('nodes.nodeName')}
                        size="sm"
                        placeholder="Marzn-Node-2"
                        {...form.register('name')}
                        error={form.formState?.errors?.name?.message}
                      />
                    </FormControl>
                    <HStack px={1}>
                      <Controller
                        name="status"
                        control={form.control}
                        render={({ field }) => {
                          return (
                            <Tooltip
                              key={field.value}
                              placement="top"
                              label={
                                `${t('usersTable.status')}: ` +
                                (field.value !== 'disabled' ? t('active') : t('disabled'))
                              }
                              textTransform="capitalize"
                            >
                              <Box mt="6">
                                <Switch
                                  colorScheme="primary"
                                  isChecked={field.value !== 'disabled'}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      field.onChange('none');
                                    } else {
                                      field.onChange('disabled');
                                    }
                                  }}
                                />
                              </Box>
                            </Tooltip>
                          );
                        }}
                      />
                    </HStack>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Box w="65%">
                      <CustomInput
                        label={t('nodes.nodeAddress')}
                        size="sm"
                        placeholder="51.20.12.13"
                        {...form.register('address')}
                        error={form.formState?.errors?.address?.message}
                      />
                    </Box>
                    <Box w="35%">
                      <CustomInput
                        label={t('nodes.nodePort')}
                        size="sm"
                        placeholder="62050"
                        {...form.register('port')}
                        error={form.formState?.errors?.port?.message}
                      />
                    </Box>
                  </HStack>
                  {!editingNode && (
                    <FormControl py={1}>
                      <Checkbox {...form.register('add_as_new_host')}>
                        <FormLabel m={0}>{t('nodes.addHostForEveryInbound')}</FormLabel>
                      </Checkbox>
                    </FormControl>
                  )}
                  <Spacer m={2}></Spacer>
                  <HStack w="full">
                    <Tooltip label={t('delete')} placement="top">
                      <IconButton
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        aria-label="delete node"
                        onClick={() => {
                          if (editingNode !== null) {
                            console.log('deleting')
                            onDeletingNode(editingNode);
                            onClose();
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      flexGrow={1}
                      type="submit"
                      colorScheme="primary"
                      size="sm"
                      px={5}
                      w="full"
                      isLoading={loading}
                    >
                      {isEditingNode ? t('nodeDialog.updateSubmit') : t('nodeDialog.addSubmit')}
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
