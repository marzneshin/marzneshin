
import { t } from 'i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { User } from 'types';
import {
    CopiedIcon,
    CopyIcon,
    QRIcon,
    SubscriptionLinkIcon
} from 'components/table';
import {
    HStack,
    IconButton,
    Tooltip,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { useUsers } from 'stores';

type ActionButtonsProps = {
    user: User;
};

export const ActionButtons: FC<ActionButtonsProps> = ({ user }) => {
    const { setQRCode, setSubLink } = useUsers();

    const proxyLinks = user.links.join('\r\n');

    const [copied, setCopied] = useState([-1, false]);
    useEffect(() => {
        if (copied[1]) {
            setTimeout(() => {
                setCopied([-1, false]);
            }, 1000);
        }
    }, [copied]);
    return (
        <HStack
            justifyContent="flex-end"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <CopyToClipboard
                text={
                    user.subscription_url.startsWith('/')
                        ? window.location.origin + user.subscription_url
                        : user.subscription_url
                }
                onCopy={() => {
                    setCopied([0, true]);
                }}
            >
                <div>
                    <Tooltip
                        label={
                            copied[0] == 0 && copied[1]
                                ? t('usersTable.copied')
                                : t('usersTable.copyLink')
                        }
                        placement="top"
                    >
                        <IconButton
                            p="0 !important"
                            aria-label="copy subscription link"
                            bg="transparent"
                            _dark={{
                                _hover: {
                                    bg: 'gray.700',
                                },
                            }}
                            size={{
                                base: 'sm',
                                md: 'md',
                            }}
                        >
                            {copied[0] == 0 && copied[1] ? (
                                <CopiedIcon />
                            ) : (
                                <SubscriptionLinkIcon />
                            )}
                        </IconButton>
                    </Tooltip>
                </div>
            </CopyToClipboard>
            <CopyToClipboard
                text={proxyLinks}
                onCopy={() => {
                    setCopied([1, true]);
                }}
            >
                <div>
                    <Tooltip
                        label={
                            copied[0] == 1 && copied[1]
                                ? t('usersTable.copied')
                                : t('usersTable.copyConfigs')
                        }
                        placement="top"
                    >
                        <IconButton
                            p="0 !important"
                            aria-label="copy configs"
                            bg="transparent"
                            _dark={{
                                _hover: {
                                    bg: 'gray.700',
                                },
                            }}
                            size={{
                                base: 'sm',
                                md: 'md',
                            }}
                        >
                            {copied[0] == 1 && copied[1] ? <CopiedIcon /> : <CopyIcon />}
                        </IconButton>
                    </Tooltip>
                </div>
            </CopyToClipboard>
            <Tooltip label="QR Code" placement="top">
                <IconButton
                    p="0 !important"
                    aria-label="qr code"
                    bg="transparent"
                    _dark={{
                        _hover: {
                            bg: 'gray.700',
                        },
                    }}
                    size={{
                        base: 'sm',
                        md: 'md',
                    }}
                    onClick={() => {
                        setQRCode(user.links);
                        setSubLink(user.subscription_url);
                    }}
                >
                    <QRIcon />
                </IconButton>
            </Tooltip>
        </HStack >
    );
};
