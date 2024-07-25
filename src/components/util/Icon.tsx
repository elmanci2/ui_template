import React, {memo} from 'react';
import {HugeiconsProps, icons} from '@hugeicons/react-native-pro';
import {ThemeType} from '../../types';
interface Props extends HugeiconsProps {
  name: keyof typeof icons;
  color?: string;
  size?: number;
  theme: ThemeType;
  forceVariant?: boolean;
  variant?: string;
}

const Icon: React.FC<Props> = memo(
  ({name, color, size, variant, theme, forceVariant = false}: Props) => {
    const LucideIcon = icons[name];

    if (!LucideIcon || !theme) {
      return null;
    }

    return (
      <LucideIcon
        color={color}
        size={size}
        variant={forceVariant ? variant : theme.icons.variant}
      />
    );
  },
);

// Memoizing with custom equality check for better performance
const areEqual = (prevProps: Props, nextProps: Props) =>
  prevProps.name === nextProps.name &&
  prevProps.color === nextProps.color &&
  prevProps.size === nextProps.size;

export default memo(Icon, areEqual);
