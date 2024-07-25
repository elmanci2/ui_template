import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {colors} from '../../config';
import {ThemeType} from '../../types';

type Props = BottomTabHeaderProps & {theme: ThemeType};

const Header = ({layout, navigation, options, route, theme}: Props) => {
  const name = route.name || '';
  const middleIndex = Math.floor(name.length / 2);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.body}]}>
      <View style={styles.area}>
        <Text style={[styles.Title, {color: theme.colors.text}]}>
          <Text style={{color: theme.colors.primary}}>
            {name.charAt(0).toUpperCase()}
          </Text>
          {name.slice(1, middleIndex)}
          <Text style={{color: theme.colors.primary}}>
            {name.charAt(middleIndex)}
          </Text>
          {name.slice(middleIndex + 1)}
        </Text>
      </View>
    </View>
  );
};

export {Header};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    paddingLeft: 10,
    paddingBottom: 80,
  },
  Title: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
  },
  FirstLetter: {
    color: colors.vermilion,
  },
  MiddleLetter: {
    color: colors.redCmyk,
  },
  area: {
    marginTop: 30,
    height: 60,
  },
});
