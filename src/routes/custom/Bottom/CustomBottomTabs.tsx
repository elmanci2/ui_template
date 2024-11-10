import React, {useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useTheme} from '@/hook/theme';
import {TabItem} from './components/TabItem';
import Icon from '@/components/util/Icon';
import {lightenColor} from '@/util';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const {width} = Dimensions.get('window'); 

const bottomHeight = 75;

const sheetHeight = 200;

const CustomBottomTabs = ({
  navigation,
  descriptors,
  state,
}: BottomTabBarProps) => {
  const {theme} = useTheme();

  const currentRouteName =
    navigation.getState().routes[navigation.getState().index].name;

  const HOME_GROUP = useMemo(() => {
    return state.routes.filter((route: any) => {
      return route.params?.group === 'home';
    });
  }, [state.routes]);

  const initialAnimation = useSharedValue(sheetHeight + bottomHeight + 10);

  useEffect(() => {
    initialAnimation.value = sheetHeight + bottomHeight + 10;
  }, []);

  const [activeBottomSheet, setActiveBottomSheet] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: initialAnimation.value}],
    };
  });

  const iconAnimateInitial = useSharedValue(0);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${iconAnimateInitial.value}rad`}],
    };
  });

  const onPressMore = () => {
    setActiveBottomSheet(!activeBottomSheet);
    if (activeBottomSheet) {
      initialAnimation.value = withSpring(-bottomHeight + bottomHeight, {
        stiffness: 200,
        damping: 18,
      });

      iconAnimateInitial.value = withSpring(Math.PI, {
        stiffness: 200,
        damping: 18,
      });
    } else {
      initialAnimation.value = withSpring(bottomHeight + sheetHeight + 10, {
        stiffness: 200,
        damping: 18,
      });

      iconAnimateInitial.value = withSpring(0, {
        stiffness: 200,
        damping: 18,
      });
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.box,
        },
      ]}>
      {HOME_GROUP?.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        return (
          <TabItem
            key={route?.key}
            {...{
              state,
              route,
              isFocused,
              navigation,
              label,
              index,
              options,
              theme,
              currentRouteName,
            }}
          />
        );
      })}

      <Animated.View style={animatedIconStyle}>
        <TouchableOpacity
          onPress={onPressMore}
          style={[
            styles.more,
            {backgroundColor: lightenColor(theme.colors.primary, 0.2)},
          ]}>
          <Icon
            name="LayerAddIcon"
            color={theme.colors.primary}
            size={24}
            theme={theme}
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.sheetMoreContainer,
          animatedStyle,
          {backgroundColor: theme.colors.box},
        ]}>
        <Text>Sheet More</Text>
      </Animated.View>
    </View>
  );
};

export {CustomBottomTabs};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 0.2,
    borderTopColor: 'rgba(156, 156, 156, 0.13)',
    width: width,
    height: bottomHeight,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },

  more: {
    padding: 17,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sheetMoreContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
    bottom: bottomHeight + 10,
    height: sheetHeight,
    borderRadius: 20,
  },
});
