import {View, Text, StyleSheet, StatusBar} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../storage';

const ThisApp = () => {
  const {theme} = useSelector((state: RootState) => state?.theme);
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.primary}]}>
      <StatusBar barStyle="light-content" />
      <Text>ThisApp</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {ThisApp};
