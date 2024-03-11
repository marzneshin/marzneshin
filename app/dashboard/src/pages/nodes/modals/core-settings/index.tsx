import {
  HStack,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react';
import { Icon } from 'components/icon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNodes } from 'stores';
import { CoreSettingModalContent } from './content';
import { UsageIcon } from './icon';

export const MAX_NUMBER_OF_LOGS = 500;


export const CoreSettingsModal: FC = () => {
  const { isEditingCore } = useNodes();
  const onClose = useNodes.setState.bind(null, { isEditingCore: false });
  const { t } = useTranslation();

  return (
    <Modal isOpen={isEditingCore} onClose={onClose} size="3xl">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent mx="3" w="full">
        <ModalHeader pt={6}>
          <HStack gap={2}>
            <Icon color="primary">
              <UsageIcon color="white" />
            </Icon>
            <Text fontWeight="semibold" fontSize="lg">
              {t('core.title')}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton mt={3} />
        <CoreSettingModalContent />
      </ModalContent>
    </Modal>
  );
};
