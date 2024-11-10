import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const HomeHeader = () => {
  return (
    <View style={styles.container}>
      <Text>HomeHeader</Text>
    </View>
  );
};

export {HomeHeader};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
});
