import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {ThemeType} from '../../types';
import Icon from './Icon';

type Props = {
  theme: ThemeType;
  onPress: () => void;
};

const BackArrow = memo(({theme, onPress}: Props) => {
  return (
    <TouchableOpacity
      style={[styles.container, {backgroundColor: theme.colors.box}]}
      onPress={onPress}>
      <Icon
        name="ArrowLeft01Icon"
        size={25}
        color={theme.colors.text}
        theme={theme}
      />
    </TouchableOpacity>
  );
});

export {BackArrow};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 50,
  },
});
