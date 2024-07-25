/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo, useCallback} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import {
  changeAutomatic,
  changeIconVariant,
  changePrimaryColor,
  changeTheme,
} from '../../storage/slices/ThemeSlice';
import Icon from './Icon';
import {IconVariant, ThemeType} from '../../types';
import {colors} from '../../config';
import {icons} from '@hugeicons/react-native-pro';
import {Title} from './Title';
import RNRestart from 'react-native-restart';

const Colors = [
  {
    solid: colors.cinnabar,
    cake: 'hsla(12, 100.00%, 66.50%, 0.40)',
  },
  {
    solid: 'red',
    cake: 'rgba(255, 210, 210, 0.93)',
  },
  {
    solid: 'green',
    cake: 'rgba(210, 255, 210, 0.93)',
  },
  {
    solid: 'blue',
    cake: 'rgba(210, 210, 255, 0.93)',
  },
  {
    solid: 'yellow',
    cake: 'rgba(255, 255, 210, 0.93)',
  },
  {
    solid: 'purple',
    cake: 'rgba(210, 210, 255, 0.93)',
  },
  {
    solid: 'orange',
    cake: 'rgba(255, 210, 210, 0.93)',
  },
];

type ColorScheme = {
  title: string;
  icon: keyof typeof icons;
  id: number;
};

const colorSchemes: ColorScheme[] = [
  {
    id: 1,
    title: 'Light',
    icon: 'Sun01Icon',
  },
  {
    id: 2,
    title: 'Dark',
    icon: 'Moon02Icon',
  },
  {
    id: 3,
    title: 'Automático',
    icon: 'Idea01Icon',
  },
];

type IconVarian = {
  title: string;
  variant: IconVariant;
};

const IconStyle: IconVarian[] = [
  {
    title: 'stroke',
    variant: 'stroke',
  },
  {
    title: 'solid',
    variant: 'solid',
  },
  {
    title: 'duotone',
    variant: 'duotone',
  },
  {
    title: 'twotone',
    variant: 'twotone',
  },
  {
    title: 'bulk',
    variant: 'bulk',
  },
];

type Props = {
  closeModal: () => void;
  theme: ThemeType;
};
const Theme = memo(({theme}: Props) => {
  const dispatch = useDispatch();

  const ChangeTheme = useCallback((active: number) => {
    if (active === 3) {
      dispatch(changeAutomatic(true));
    } else {
      dispatch(changeAutomatic(false));
      if (active === 1) {
        dispatch(changeTheme(true));
      } else {
        dispatch(changeTheme(false));
      }
    }
  }, []);

  const changeVariant = useCallback((variant: IconVariant) => {
    dispatch(changeIconVariant(variant));
    RNRestart.restart();
  }, []);
  const changeColor = useCallback((color: string) => {
    dispatch(changePrimaryColor(color));
  }, []);

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      ListEmptyComponent={
        <View style={styles.container}>
          <View style={styles.Title}>
            <Title title="Tema" theme={theme} />
          </View>

          <FlatList
            horizontal={true}
            data={colorSchemes}
            style={styles.FlatList}
            contentContainerStyle={styles.ColorsSchemeContainer}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.itemColorScheme,
                  {backgroundColor: theme.colors.box},
                  theme.automatic &&
                    item.id === 3 && {
                      borderColor: theme.colors.primary,
                      borderWidth: 2,
                    },
                  !theme.automatic &&
                    theme.theme &&
                    item.id === 1 && {
                      borderColor: theme.colors.primary,
                      borderWidth: 2,
                    },
                  !theme.automatic &&
                    !theme.theme &&
                    item.id === 2 && {
                      borderColor: theme.colors.primary,
                      borderWidth: 2,
                    },
                ]}
                onPress={() => ChangeTheme(item.id)}>
                <Icon
                  name={item.icon as keyof typeof icons}
                  size={25}
                  color={theme.colors.text}
                  theme={theme}
                />
                <Text style={[styles.subtitle, {color: theme.colors.text}]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.Title}>
            <Title title="Iconos" theme={theme} />
          </View>
          <FlatList
            data={IconStyle}
            numColumns={3}
            columnWrapperStyle={styles.gap}
            contentContainerStyle={styles.gap}
            keyExtractor={item => item.title}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.itemColorScheme,
                    {backgroundColor: theme.colors.box},
                  ]}
                  onPress={() => changeVariant(item.variant)}>
                  <Icon
                    name={'WinkIcon'}
                    size={25}
                    color={theme.colors.text}
                    theme={theme}
                    forceVariant={true}
                    variant={item.variant}
                  />
                  <Text style={[styles.subtitle, {color: theme.colors.text}]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          <View style={styles.Title}>
            <Title title="Colores" theme={theme} />
          </View>

          <FlatList
            contentContainerStyle={[styles.gap]}
            columnWrapperStyle={styles.gap}
            data={Colors}
            showsVerticalScrollIndicator={false}
            numColumns={3}
            keyExtractor={item => item.solid}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => changeColor(item.solid)}
                style={[
                  styles.Items,
                  {
                    backgroundColor:
                      theme.colors.primary === item.solid
                        ? item.cake
                        : theme.colors.box,
                  },
                ]}>
                <Icon
                  name={'Orbit01Icon'}
                  size={45}
                  color={item.solid}
                  theme={theme}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      }
    />
  );
});

export {Theme};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  border: {
    borderWidth: 2,
  },
  Items: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  gap: {
    gap: 10,
  },

  itemColorScheme: {
    padding: 10,
    gap: 20,
    borderRadius: 10,
    maxHeight: 100,
    minWidth: 100,
  },

  ColorsSchemeContainer: {
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },

  subtitle: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },

  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },

  FlatList: {maxHeight: 110},
  Title: {
    paddingHorizontal: 20,
    width: '100%',
    alignSelf: 'flex-end',
  },
});
