import {StyleSheet} from 'react-native';
import React from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Home, SettingScreen} from '@/screen';
import {CustomBottomTabs} from './CustomBottomTabs';
import {Header, HomeHeader} from '@/components/custom';
import {useTheme} from '@/hook/theme';

// todo:bottom tab navigation
const Bottom = createBottomTabNavigator();

type Screen = {
  name: string;
  component: any;
  options: BottomTabNavigationOptions;
  initialParams: any;
};

type Screens = {
  [key: string]: Screen[];
};

const TABS_GROUP: Screens = {
  HOME: [
    {
      name: 'Inicio',
      component: Home,
      options: {
        header: HomeHeader,
      },

      initialParams: {
        group: 'home',
      },
    },
    {
      name: 'tv',
      component: Home,
      options: {},

      initialParams: {
        group: 'home',
      },
    },
    {
      name: 'upcoming',
      component: Home,
      options: {},
      initialParams: {
        group: 'home',
      },
    },
  ],

  HOME_MORE: [
    {
      name: 'news',
      component: SettingScreen,
      options: {},

      initialParams: {
        group: 'more_home',
      },
    },
    {
      name: 's',
      component: Home,
      options: {},
      initialParams: {
        group: 'more_home',
      },
    },
  ],
};

const BottomTabs = () => {
  const {theme} = useTheme();

  return (
    <Bottom.Navigator
      tabBar={props => <CustomBottomTabs {...props} />}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.box,
          borderTopEndRadius: 15,
          borderTopStartRadius: 15,
          position: 'absolute',
        },
        header(props) {
          return <Header {...{...props, theme}} />;
        },
      }}>
      <Bottom.Group>
        {TABS_GROUP.HOME.map((screen, index) => (
          <Bottom.Screen key={index} {...screen} />
        ))}
      </Bottom.Group>

      <Bottom.Group navigationKey="more_home">
        {TABS_GROUP.HOME_MORE.map((screen, index) => (
          <Bottom.Screen key={index} {...screen} />
        ))}
      </Bottom.Group>
    </Bottom.Navigator>
  );
};

export {BottomTabs};

const styles = StyleSheet.create({});
