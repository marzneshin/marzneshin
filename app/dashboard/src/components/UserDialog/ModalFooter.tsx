import React from 'react';
import {
    Button,
    Tooltip,
    HStack,
    IconButton,
    Spinner,
} from "@chakra-ui/react";
import { DeleteIcon } from "../DeleteUserModal";
import { UserUsageIcon } from "./UserDialogIcons";
import { useTranslation } from 'react-i18next';
import { User } from 'types/User';
import { ModalFooter } from '@chakra-ui/react';

interface UserDialogFooterProps {
    isEditing: boolean;
    onDeletingUser: (user: User) => void;
    handleUsageToggle: () => void;
    handleResetUsage: () => void;
    handleRevokeSubscription: () => void;
    loading: boolean;
    editingUser: User | null;
    onClose: () => void;
}

export const UserDialogModalFooter: React.FC<UserDialogFooterProps> = ({
    isEditing,
    onClose, editingUser,
    onDeletingUser,
    handleUsageToggle,
    handleResetUsage,
    handleRevokeSubscription,
    loading,
}) => {

    const { t, i18n } = useTranslation();
    return (

        <ModalFooter mt="3">
            <HStack
                justifyContent="space-between"
                w="full"
                gap={3}
                flexDirection={{
                    base: "column",
                    sm: "row",
                }}
            >
                <HStack
                    justifyContent="flex-start"
                    w={{
                        base: "full",
                        sm: "unset",
                    }}
                >
                    {isEditing && editingUser !== null && (
                        <>
                            <Tooltip label={t("delete")} placement="top">
                                <IconButton
                                    aria-label="Delete"
                                    size="sm"
                                    onClick={() => {
                                        onDeletingUser(editingUser);
                                        onClose();
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip label={t("userDialog.usage")} placement="top">
                                <IconButton
                                    aria-label="usage"
                                    size="sm"
                                    onClick={handleUsageToggle}
                                >
                                    <UserUsageIcon />
                                </IconButton>
                            </Tooltip>
                            <Button onClick={handleResetUsage} size="sm">
                                {t("userDialog.resetUsage")}
                            </Button>
                            <Button onClick={handleRevokeSubscription} size="sm">
                                {t("userDialog.revokeSubscription")}
                            </Button>
                        </>
                    )}
                </HStack>
                <HStack
                    w="full"
                    maxW={{ md: "50%", base: "full" }}
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
                        {isEditing ? t("userDialog.editUser") : t("createUser")}
                    </Button>
                </HStack>
            </HStack>
        </ModalFooter >
    );
};
