import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import Icon from './Icon';
import {ThemeType} from '../../types';

type Props = {
  action: () => void;
  theme: ThemeType;
};

const CloseButton = memo(({action, theme}: Props) => {
  if (!action) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={action}
      style={[styles.container, {backgroundColor: theme.colors.box}]}>
      <Icon
        name={'Cancel01Icon'}
        size={30}
        color={theme.colors.text}
        theme={theme}
      />
    </TouchableOpacity>
  );
});

export {CloseButton};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    padding: 5,
  },
});
