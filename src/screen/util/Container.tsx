import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../storage';

type Props = {
  children: React.ReactNode;
};

const Container = ({children}: Props) => {
  const {theme} = useSelector((state: RootState) => state.theme);
  return (
    <View style={[{backgroundColor: theme.colors.body}, styles.container]}>
      {children}
    </View>
  );
};

export {Container};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 6,
  },
});
