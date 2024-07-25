import {icons} from '@hugeicons/react-native-pro';

type ThemeType = {
  theme: boolean;
  automatic: boolean;
  colors: {
    primary: string;
    secondary: string;
    body: string;
    text: string;
    box: string;
  };

  icons: {
    variant: IconVariant;
  };
};

type IconsType = keyof typeof icons;
type IconVariant = 'stroke' | 'solid' | 'duotone' | 'twotone' | 'bulk';
interface SettingItem {
  title: string;
  subtitle: string;
  icon: IconsType;
  value: boolean;
  type?: 'switch' | 'arrow';
  iconsType: IconVariant;
  actionType: 'switch' | 'modal' | 'link' | 'navigation';
  switchAction?: () => void;
  navigationAction?: (route: string) => void;
  route?: string | any;
  modalAction?: (identify: string) => void;
  modalIdentify?: string;
}

interface SettingCategory {
  title: string;
  items: SettingItem[];
}

export type {ThemeType, SettingItem, SettingCategory, IconVariant, IconsType};
