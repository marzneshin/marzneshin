import {
  Button,
  Select as ChakraSelect,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Tooltip,
  VStack,
  chakra,
  useToast,
  Spacer,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Text,
  Badge,
  Alert,
  AlertIcon,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useState } from 'react';
import { useInbounds, HostType, HostSchema, hostSchema } from 'stores';
import { Trans, useTranslation } from 'react-i18next';
import { getDefaultValues } from './default-values';
import { useForm } from 'react-hook-form';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { DialogModalHeader, AddIcon, DeleteIcon } from 'components/dialog';
import { Input as CustomInput } from 'components/input';
import { EditIcon } from 'components/table';
import { InfoIcon } from './icons';
import {
  proxyALPN,
  proxyFingerprint,
  proxyHostSecurity,
} from 'constants/Proxies';
import { RemarkFieldPopover } from './remark-field-popover';

export const Select = chakra(ChakraSelect, {
  baseStyle: {
    bg: 'white',
    _dark: {
      bg: 'gray.700',
    },
  },
});

export const Input = chakra(CustomInput, {
  baseStyle: {
    bg: 'white',
    _dark: {
      bg: 'gray.700',
    },
  },
});

/* TODO: Impelement specific errors and input verifications
 * */
export const HostsDialog: FC = () => {
  const {
    selectedHost, isEditingHost, isCreatingHost, selectedInbound,
    onEditingHost, editHost, createHost, onCreatingHost, onDeletingHost
  } = useInbounds();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('');
  const { t } = useTranslation();
  const toast = useToast();
  const defaultValueHost: HostSchema = (isEditingHost === true && selectedHost !== null) ? selectedHost : getDefaultValues();
  const form = useForm<HostSchema>({
    resolver: zodResolver(hostSchema),
    defaultValues: defaultValueHost,
  });
  const isOpen = isEditingHost || isCreatingHost;
  const onClose = () => {
    onCreatingHost(false);
    onEditingHost(false, null);
  };
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValueHost);
    }
  }, [isOpen]);

  const submit = async (values: HostSchema | HostType) => {
    setLoading(true);
    const methods = { edited: editHost, created: createHost };
    const method = isEditingHost ? 'edited' : 'created';
    const refId = (isEditingHost ? selectedHost?.id : null) ?? selectedInbound?.id;
    setError(null);
    await methods[method](refId, values)
      .then(() => {
        toast({
          title: t(
            isEditingHost ? 'hostsDialog.editHost' : 'hostsDialog.createNewHost',
            { hoshtName: values.host }
          ),
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 3000,
        });
        // refetchNodes();
        onClose();
      })
      .catch((err) => {
        if (err?.response?.status === 409 || err?.response?.status === 400)
          setError(err?.response?._data?.detail);
        if (err?.response?.status === 422) {
          Object.keys(err.response._data.detail).forEach((key) => {
            setError(err?.response._data.detail[key] as string);
            form.setError(
              key as 'address' | 'port' | 'host' | 'path' | 'remark' | 'sni' | 'security' | 'alpn' | 'fingerprint',
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent mx="3" w="lg" >
        <DialogModalHeader HeaderIcon={isEditingHost ? EditIcon : AddIcon} title={isEditingHost ? t('hostsDialog.editHost') : t('hostsDialog.createHost')} />
        <ModalCloseButton mt={3} />
        <ModalBody pb={4} pt={3}>
          {loading && 'loading...'}
          <form onSubmit={form.handleSubmit((v) => submit(v))}>
            <VStack>
              <HStack w="100%" alignItems="flex-start">
                <FormControl
                  position="relative"
                  zIndex={10}
                >
                  <InputGroup>
                    <Input
                      {...form.register('remark')}
                      size="sm"
                      borderRadius="4px"
                      placeholder="Remark"
                    />
                    <InputRightElement>
                      <RemarkFieldPopover />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </HStack>
              <FormControl>
                <InputGroup>
                  <Input
                    size="sm"
                    borderRadius="4px"
                    placeholder="Address (e.g. example.com)"
                    {...form.register('address')}
                  />
                  <InputRightElement>
                    <RemarkFieldPopover />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel
                  display="flex"
                  pb={1}
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1}
                  m="0"
                >
                  <span>{t('hostsDialog.port')}</span>
                  <Popover isLazy placement="right">
                    <PopoverTrigger>
                      <InfoIcon />
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent p={2}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <Text fontSize="xs" pr={5}>
                          {t('hostsDialog.port.info')}
                        </Text>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                </FormLabel>
                <Input
                  size="sm"
                  borderRadius="4px"
                  placeholder={String(selectedInbound?.port || '8080')}
                  type="number"
                  {...form.register('port')}
                />
              </FormControl>
              <FormControl>
                <FormLabel
                  display="flex"
                  pb={1}
                  alignItems="center"
                  gap={1}
                  justifyContent="space-between"
                  m="0"
                >
                  <span>{t('hostsDialog.sni')}</span>
                  <Popover isLazy placement="right">
                    <PopoverTrigger>
                      <InfoIcon />
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent p={2}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <Text fontSize="xs" pr={5}>
                          {t('hostsDialog.sni.info')}
                        </Text>
                        <Text fontSize="xs" mt="2">
                          <Trans
                            i18nKey="hostsDialog.host.wildcard"
                            components={{
                              badge: <Badge />,
                            }}
                          />
                        </Text>
                        <Text fontSize="xs">
                          <Trans
                            i18nKey="hostsDialog.host.multiHost"
                            components={{
                              badge: <Badge />,
                            }}
                          />
                        </Text>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                </FormLabel>
                <Input
                  size="sm"
                  borderRadius="4px"
                  placeholder="SNI (e.g. example.com)"
                  {...form.register('sni')}
                />
              </FormControl>
              <FormControl>
                <FormLabel
                  display="flex"
                  pb={1}
                  alignItems="center"
                  gap={1}
                  justifyContent="space-between"
                  m="0"
                >
                  <span>{t('hostsDialog.host')}</span>

                  <Popover isLazy placement="right">
                    <PopoverTrigger>
                      <InfoIcon />
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent p={2}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <Text fontSize="xs" pr={5}>
                          {t('hostsDialog.host.info')}
                        </Text>
                        <Text fontSize="xs" mt="2">
                          <Trans
                            i18nKey="hostsDialog.host.wildcard"
                            components={{
                              badge: <Badge />,
                            }}
                          />
                        </Text>
                        <Text fontSize="xs">
                          <Trans
                            i18nKey="hostsDialog.host.multiHost"
                            components={{
                              badge: <Badge />,
                            }}
                          />
                        </Text>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                </FormLabel>
                <Input
                  size="sm"
                  borderRadius="4px"
                  placeholder="Host (e.g. example.com)"
                  {...form.register('host')}
                />
              </FormControl>
              <FormControl>
                <FormLabel
                  display="flex"
                  pb={1}
                  alignItems="center"
                  gap={1}
                  justifyContent="space-between"
                  m="0"
                >
                  <span>{t('hostsDialog.path')}</span>
                  <Popover isLazy placement="right">
                    <PopoverTrigger>
                      <InfoIcon />
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent p={2}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <Text fontSize="xs" pr={5}>
                          {t('hostsDialog.path.info')}
                        </Text>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                </FormLabel>
                <Input
                  size="sm"
                  borderRadius="4px"
                  placeholder="path (e.g. /vless)"
                  {...form.register('path')}
                />
              </FormControl>
              <FormControl height="66px">
                <FormLabel
                  display="flex"
                  pb={1}
                  alignItems="center"
                  gap={1}
                  justifyContent="space-between"
                  m="0"
                >
                  <span>{t('hostsDialog.security')}</span>
                  <Popover isLazy placement="right">
                    <PopoverTrigger>
                      <InfoIcon />
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent p={2}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <Text fontSize="xs" pr={5}>
                          {t('hostsDialog.security.info')}
                        </Text>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                </FormLabel>
                <Select size="sm" {...form.register('security')} >
                  {proxyHostSecurity.map((s) => {
                    return (
                      <option key={s.value} value={s.value}>
                        {s.title}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              {/* TODO: Add ALPN and fingerprint fields smooth entrance and
                  * pushing down animation when security field is TLS
                  * - Insertion and pushing down the below element 
                  * - Slowly increasing the opacity 
                  * Related issue: #95
                  */}
              <FormControl height="66px">
                <FormLabel
                  display="flex"
                  pb={1}
                  alignItems="center"
                  gap={1}
                  justifyContent="space-between"
                  m="0"
                >
                  <span>{t('hostsDialog.alpn')}</span>
                </FormLabel>
                <Select
                  size="sm"
                  {...form.register('alpn')}
                >
                  {proxyALPN.map((s) => {
                    return (
                      <option key={s.value} value={s.value}>
                        {s.title}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl height="66px">
                <FormLabel
                  display="flex"
                  pb={1}
                  alignItems="center"
                  gap={1}
                  justifyContent="space-between"
                  m="0"
                >
                  <span>{t('hostsDialog.fingerprint')}</span>
                </FormLabel>
                <Select
                  size="sm"
                  {...form.register('fingerprint')}
                >
                  {proxyFingerprint.map((s) => {
                    return (
                      <option key={s.value} value={s.value}>
                        {s.title}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <Spacer m={2}></Spacer>
              <HStack w="full">
                <Tooltip label={t('delete')} placement="top">
                  <IconButton
                    colorScheme="red"
                    variant="ghost"
                    size="sm"
                    aria-label="delete host"
                    onClick={() => {
                      if (selectedHost !== null) {
                        onDeletingHost(true, selectedHost);
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
                  {isEditingHost ? t('hostsDialog.editSubmit') : t('hostsDialog.createSubmit')}
                </Button>
              </HStack>
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
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
