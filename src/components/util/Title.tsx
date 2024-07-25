import {StyleSheet, Text, TextStyle, View} from 'react-native';
import React from 'react';
import {ThemeType} from '../../types';
type Props = {
  title: string;
  theme: ThemeType;
  size?: number;
  subTitle?: string;
  subTitleSize?: number;
  style?: TextStyle;
  subTitleStyle?: TextStyle;
  numberOfLines?: number | undefined;
};
const Title = ({
  title,
  theme,
  size = 20,
  subTitle,
  subTitleSize = 15,
  style,
  subTitleStyle,
  numberOfLines = undefined,
}: Props) => {
  return (
    <View>
      <Text
        numberOfLines={numberOfLines}
        style={[
          styles.title,
          {color: theme.colors.text, fontSize: size},
          style,
        ]}>
        {title}
      </Text>
      {subTitle && (
        <Text
          style={[
            styles.SubTitle,
            {color: theme.colors.text, fontSize: subTitleSize},
            subTitleStyle,
          ]}>
          {subTitle}
        </Text>
      )}
    </View>
  );
};

export {Title};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Poppins-Bold',
  },

  SubTitle: {
    fontFamily: 'Poppins-Regular',
  },
});
