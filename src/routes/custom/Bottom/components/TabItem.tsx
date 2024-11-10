import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useEffect} from 'react';
import {BottomRenderIcon, SecanBottomRenderIcon} from './BottomRenderIcon';
import {lightenColor} from '@/util';
import {icons} from '@hugeicons/react-native-pro';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import {ThemeType} from '@/types';

type IconType = {
  [key: string]: {
    icon: keyof typeof icons;
    route: string;
  };
};

const moreIconsName: IconType = {
  tv: {
    icon: 'Tv01Icon',
    route: 'tv',
  },
  upcoming: {
    icon: 'NewsIcon',
    route: 'news',
  },
  inicio: {
    icon: 'Home01Icon',
    route: 'inicio',
  },
};

type Props = {
  state: {index: number};
  options: {tabBarAccessibilityLabel: string; tabBarTestID: string};
  theme: ThemeType;
  route: {key: string; name: string};
  navigation: any;
  index: number;
  currentRouteName: string;
};

const TabItem = memo((props: Props | any) => {
  const {state, options, theme, route, navigation, index, currentRouteName} =
    props;

  const activeColor = lightenColor(theme?.colors?.primary, 0.1);
  const inactiveColor = lightenColor(theme?.colors?.box, 1.04);
  const IconName = moreIconsName[route?.name];
  const isMoreFocused = IconName?.route === currentRouteName;
  const isFocused = state.index === index || isMoreFocused;

  const tabBackgroundColor = !isFocused ? inactiveColor : activeColor;

  const scaleActive = useSharedValue(1);
  const scaleInactive = useSharedValue(1);
  const opacityInactive = useSharedValue(1);

  const onPress = () => {
    const event: any = navigation.emit({
      type: 'tabPress',
      target: route.key,
    } as any);

    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const onPressMore = () => {
    navigation.navigate(IconName?.route);
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  useEffect(() => {
    if (isFocused) {
      scaleActive.value = withSpring(1.2, {
        stiffness: 200,
        damping: 10,
      });

      scaleInactive.value = withTiming(1, {duration: 0});
      opacityInactive.value = withTiming(1, {duration: 0});
    } else {
      scaleActive.value = withTiming(1, {
        duration: 300,
      });

      scaleInactive.value = withTiming(0.5, {
        duration: 300,
      });
      opacityInactive.value = withTiming(0, {
        duration: 300,
      });
    }
  }, [isFocused]);

  const animatedStyleActive = useAnimatedStyle(() => {
    return {
      transform: [{scale: scaleActive.value}],
    };
  });

  return (
    <View
      key={props.route.key}
      accessibilityRole="button"
      accessibilityState={isFocused ? {selected: true} : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      style={[styles.tab, {backgroundColor: tabBackgroundColor}]}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.activeTab}
        onLongPress={onLongPress}
        activeOpacity={0.8}>
        <View>
          <BottomRenderIcon
            {...props}
            color={
              isFocused && !isMoreFocused
                ? theme?.colors?.primary
                : theme?.colors?.text
            }
            ColorBg={isFocused && !isMoreFocused ? inactiveColor : undefined}
          />
        </View>
      </TouchableOpacity>
      {isFocused && IconName && (
        <TouchableOpacity style={styles.activeTab} onPress={onPressMore}>
          <Animated.View style={animatedStyleActive}>
            <SecanBottomRenderIcon
              radius={isMoreFocused ? 50 : undefined}
              name={IconName?.icon}
              {...props}
              bgColor={isMoreFocused ? inactiveColor : undefined}
            />
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
});

export {TabItem};

const styles = StyleSheet.create({
  tab: {
    padding: 7,
    paddingHorizontal: 8,
    gap: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  activeTab: {
    padding: 7,
    borderRadius: 12,
  },
  tabLabel: {
    color: '#666',
  },
  activeLabel: {
    color: '#000',
    fontWeight: 'bold',
  },
});
