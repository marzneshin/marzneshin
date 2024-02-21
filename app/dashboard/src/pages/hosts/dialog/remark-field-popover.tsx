
import { InfoIcon } from './icons';
import {
  Badge,
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

export const RemarkFieldPopover = () => {
  const { t } = useTranslation();
  return (
    <Popover isLazy placement="right">
      <PopoverTrigger>
        <Box mt="-8px">
          <InfoIcon />
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Box fontSize="xs">
              <Text pr="20px">{t('hostsDialog.desc')}</Text>
              <Text>
                <Badge>
                  {'{'}SERVER_IP{'}'}
                </Badge>{' '}
                {t('hostsDialog.currentServer')}
              </Text>
              <Text mt={1}>
                <Badge>
                  {'{'}USERNAME{'}'}
                </Badge>{' '}
                {t('hostsDialog.username')}
              </Text>
              <Text mt={1}>
                <Badge>
                  {'{'}DATA_USAGE{'}'}
                </Badge>{' '}
                {t('hostsDialog.dataUsage')}
              </Text>
              <Text mt={1}>
                <Badge>
                  {'{'}DATA_LEFT{'}'}
                </Badge>{' '}
                {t('hostsDialog.remainingData')}
              </Text>
              <Text mt={1}>
                <Badge>
                  {'{'}DATA_LIMIT{'}'}
                </Badge>{' '}
                {t('hostsDialog.dataLimit')}
              </Text>
              <Text mt={1}>
                <Badge>
                  {'{'}DAYS_LEFT{'}'}
                </Badge>{' '}
                {t('hostsDialog.remainingDays')}
              </Text>
              <Text mt={1}>
                <Badge>
                  {'{'}EXPIRE_DATE{'}'}
                </Badge>{' '}
                {t('hostsDialog.expireDate')}
              </Text>
              <Text mt={1}>
                <Badge>
                  {'{'}JALALI_EXPIRE_DATE{'}'}
                </Badge>{' '}
                {t('hostsDialog.jalaliExpireDate')}
              </Text>
              <Text mt={1}>
                <Badge>
                  {'{'}TIME_LEFT{'}'}
                </Badge>{' '}
                {t('hostsDialog.remainingTime')}
              </Text>
              <Text mt={1}>
                <Badge>
                  {'{'}STATUS_EMOJI{'}'}
                </Badge>{' '}
                {t('hostsDialog.statusEmoji')}
              </Text>
              <Text mt={1}>
                <Badge>
                  {'{'}PROTOCOL{'}'}
                </Badge>{' '}
                {t('hostsDialog.proxyProtocol')}
              </Text>
              <Text mt={1}>
                <Badge>
                  {'{'}TRANSPORT{'}'}
                </Badge>{' '}
                {t('hostsDialog.proxyMethod')}
              </Text>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
