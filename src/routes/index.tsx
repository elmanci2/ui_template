/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  NativeStackHeaderProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
// todo:screen
import {
  Player,
  Preview,
  Search,
  All,
  ThisApp,
  Download,
  Reporting,
  TermAndCondition,
  Files,
  Folder,
} from '../screen';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {
  AppState,
  AppStateStatus,
  StatusBar,
  useColorScheme,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../storage';
import {ThemeType} from '../types';
import switchTheme from 'react-native-theme-switch-animation';
import {changeTheme} from '../storage/slices/ThemeSlice';
import {HeaderMinimalist} from '../screen/archives/components';
import { BottomTabs } from './custom/Bottom';

const Stack = createNativeStackNavigator();

// todo:stack navigation
export const StackRoutes = memo(({theme}: {theme: ThemeType}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_left',
        animationDuration: 500,
        orientation: 'portrait',
      }}>
      <Stack.Screen name="Home" component={BottomTabs} />
      <Stack.Screen
        name="Player"
        component={Player}
        options={{
          orientation: 'landscape',
          animation: 'fade',
          presentation: 'transparentModal',
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen name="Preview" component={Preview} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="All" component={All} />
      <Stack.Screen name="ThisApp" component={ThisApp} />
      <Stack.Screen
        name="Reporting"
        component={Reporting}
        options={{animation: 'slide_from_right', animationDuration: 500}}
      />
      <Stack.Screen
        name="Download"
        component={Download}
        options={{animation: 'slide_from_right', animationDuration: 500}}
      />
      <Stack.Screen name="TermAndCondition" component={TermAndCondition} />

      <Stack.Group
        screenOptions={{
          headerShown: true,
          animation: 'slide_from_left',
          animationDuration: 500,
          orientation: 'portrait',
          header: (props: NativeStackHeaderProps) =>
            HeaderMinimalist({...props, theme}),
        }}>
        <Stack.Screen name="Files" component={Files} initialParams={{theme}} />
        <Stack.Screen
          name="Folder"
          component={Folder}
          initialParams={{theme}}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
});

export const Routes = memo(() => {
  const {theme} = useSelector((state: RootState) => state.theme);

  const colorScheme = useColorScheme();

  const dispatcher = useDispatch();
  const ChangeTheme = useCallback(
    (active: boolean) => {
      switchTheme({
        switchThemeFunction: () => {
          dispatcher(changeTheme(active));
        },
        animationConfig: {
          type: 'circular',
          duration: 300,
          startingPoint: {
            cxRatio: 0.5,
            cyRatio: 0.5,
          },
        },
      });
    },
    [colorScheme],
  );

  useEffect(() => {
    if (theme.automatic) {
      if (colorScheme === 'dark') {
        ChangeTheme(false);
      } else {
        ChangeTheme(true);
      }
    }
  }, [colorScheme, theme.automatic]);

  const [appState, setAppState] = useState(AppState.currentState);
  const navigationRef =
    useRef<NavigationContainerRef<ReactNavigation.RootParamList>>(null);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        const lastRoute = await AsyncStorage.getItem('lastRoute');
        if (lastRoute && navigationRef.current?.isReady()) {
          navigationRef.current.navigate(lastRoute as never); // Adjust as necessary based on your route parameters
        }
      } else if (nextAppState === 'background') {
        const route = navigationRef.current?.getCurrentRoute();
        if (route) {
          await AsyncStorage.setItem('lastRoute', route.name);
        }
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <NavigationContainer ref={navigationRef as any}>
      <StatusBar
        barStyle={!theme.theme ? 'light-content' : 'dark-content'}
        translucent
        animated
        backgroundColor={'transparent'}
      />
      <StackRoutes theme={theme} />
    </NavigationContainer>
  );
});
