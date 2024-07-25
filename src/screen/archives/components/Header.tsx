import {StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {ThemeType} from '../../../types';
import {BackArrow} from '../../../components';
type Props = NativeStackHeaderProps & {
  theme: ThemeType;
  moreOptions?: React.ReactNode;
};

const HeaderMinimalist = ({
  layout,
  navigation,
  options,
  route,
  theme,
}: Props) => {
  const canGoBack = useMemo(() => navigation.canGoBack(), [navigation]);
  const tintColor = useMemo(() => theme.colors.primary, [theme]);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.body}]}>
      <View style={styles.area}>
        <BackArrow theme={theme} onPress={() => navigation.goBack()} />
        <View style={styles.MoreOptions}>
          {options?.headerRight && options?.headerRight({canGoBack, tintColor})}
        </View>
      </View>
    </View>
  );
};

export {HeaderMinimalist};

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

  area: {
    marginTop: 30,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  MoreOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
