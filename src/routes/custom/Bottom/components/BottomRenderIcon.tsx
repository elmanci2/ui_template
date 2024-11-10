import Icon from '@/components/util/Icon';
import {ThemeType} from '@/types';
import {icons} from '@hugeicons/react-native-pro';
import {memo} from 'react';
import {StyleSheet, View} from 'react-native';

type IconType = {
  [key: string]: keyof typeof icons;
};

const iconsMap: IconType = {
  Inicio: 'Home01Icon',
  tv: 'Tv01Icon',
  upcoming: 'PlaySquareIcon',
};

export const SecanBottomRenderIcon = memo(
  (props: {
    name: keyof typeof icons;
    color?: string;
    size?: number;
    theme: ThemeType;
    bgColor?: string;
    radius?: number;
  }) => {
    const {theme, name, color, size, bgColor, radius} = props;
    return (
      <View
        style={[styles.icon, {backgroundColor: bgColor, borderRadius: radius}]}>
        <Icon
          name={name}
          color={color ?? theme?.colors?.primary}
          size={size ?? 24}
          theme={theme}
        />
      </View>
    );
  },
);

export const BottomRenderIcon = memo(
  (props: {
    route: {name: string};
    color?: string;
    size?: number;
    theme: ThemeType;
    ColorBg?: string;
  }) => {
    const {theme, route, color, size, ColorBg} = props;

    const IconName = iconsMap[route?.name] || iconsMap.upcoming;
    return (
      <View style={{backgroundColor: ColorBg, borderRadius: 50}}>
        <Icon
          name={IconName}
          color={color ?? theme?.colors?.primary}
          size={size ?? 28}
          theme={theme}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  icon: {borderRadius: 50, padding: 5},
});
