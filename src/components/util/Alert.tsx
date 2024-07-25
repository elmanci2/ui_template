/* eslint-disable react-native/no-inline-styles */
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {CloseButton} from './CloseButton';
import {ThemeType} from '../../types';

type Props = {
  title: string;
  message?: string;
  onPress: () => void;
  children?: React.ReactNode;
  visible: boolean;
  theme: ThemeType;
};

const Alert = memo(
  ({title, message, onPress, children, visible = false, theme}: Props) => {
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onPress}
        statusBarTranslucent>
        <Pressable
          onPress={onPress}
          style={[
            styles.hiddenBackground,
            {
              backgroundColor: !theme.theme
                ? 'rgba(255, 255, 255, 0.57)'
                : 'rgba(0, 0, 0, 0.57)',
            },
          ]}
        />
        <View style={[styles.contendContainer]}>
          <View
            style={[styles.container, {backgroundColor: theme.colors.body}]}>
            <View style={styles.header}>
              <CloseButton action={onPress} theme={theme} />
              <Text style={[styles.title, {color: theme.colors.text}]}>
                {title}
              </Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.message}>{message}</Text>
              {children}
            </View>
          </View>
        </View>
      </Modal>
    );
  },
);

export {Alert};

const styles = StyleSheet.create({
  hiddenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,

    zIndex: -10,
  },

  container: {
    width: '60%',
    alignSelf: 'center',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 15,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },

  body: {
    width: '90%',
    flexDirection: 'column',
    gap: 10,
  },

  contendContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  message: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
});
