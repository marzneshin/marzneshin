import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  chakra,
  MenuList,
} from '@chakra-ui/react';
import { DONATION_URL } from 'constants/Project'
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const iconProps = {
  baseStyle: {
    w: 4,
    h: 4,
  },
};

const SettingsIcon = chakra(Bars3Icon, iconProps);
const LogoutIcon = chakra(ArrowLeftStartOnRectangleIcon, iconProps);
const DonationIcon = chakra(CurrencyDollarIcon, iconProps);

type HeaderMenuProps = {};

export const HeaderMenu: FC<HeaderMenuProps> = () => {
  const { t } = useTranslation('header');
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        size="sm"
        variant="outline"
        icon={<SettingsIcon />}
        position="relative"
      ></MenuButton>
      <MenuList minW="170px" zIndex={99999} className="menuList">
        <Link to={DONATION_URL} target="_blank">
          <MenuItem
            maxW="170px"
            fontSize="sm"
            icon={<DonationIcon />}
            position="relative"
          >
            {t('donation')}{' '}
          </MenuItem>
        </Link>
        <Link to="/login">
          <MenuItem maxW="170px" fontSize="sm" icon={<LogoutIcon />}>
            {t('logout')}
          </MenuItem>
        </Link>
      </MenuList>
    </Menu>
  )
}
