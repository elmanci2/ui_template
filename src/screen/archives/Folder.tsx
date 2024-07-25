/* eslint-disable react-hooks/exhaustive-deps */
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Container} from '../util/Container';
import {HeaderButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {Title} from '../../components';
import RNFS from 'react-native-fs';
import Icon from '../../components/util/Icon';

const headerRight = ({item, theme}: any) => {
  return (
    <View style={styles.headerRight}>
      <Title
        title={item?.name}
        theme={theme}
        size={25}
        style={{width: '60%', marginLeft: 10}}
        numberOfLines={1}
      />
    </View>
  );
};

const RedondearSize = (size: number) => {
  const sizeInMB = size / 1024 / 1024;
  return sizeInMB.toFixed(2);
};

const Folder = ({navigation, route}: any) => {
  const {theme, item} = route.params;
  const [Files, setFiles] = useState<any>([]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: (props: HeaderButtonProps) =>
        headerRight({...props, theme, item}),
    });
  }, [theme]);

  useEffect(() => {
    const listAppDirectory = async () => {
      try {
        const files = await RNFS.readDir(item.path);
        const Folders = files.filter(file => file.isFile());
        setFiles(Folders);
      } catch (error) {
        console.error('Error al leer el directorio:', error);
      }
    };

    listAppDirectory();
  }, []);

  console.log(Files);

  return (
    <Container>
      <FlatList
        data={Files}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('Player', {file: item.path})}
              key={item.name}
              style={[styles.box, {backgroundColor: theme.colors.box}]}>
              <Icon
                theme={theme}
                name="VideoReplayIcon"
                size={30}
                color={theme.colors.text}
              />
              <View style={styles.boxText}>
                <Text style={[styles.text, {color: theme.colors.text}]}>
                  {item.name}
                </Text>
                <Text style={(styles.subText, {color: theme.colors.text})}>
                  {RedondearSize(item.size) + ' MB'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </Container>
  );
};

export {Folder};

const styles = StyleSheet.create({
  headerRight: {
    width: '100%',
    padding: 10,
    borderRadius: 50,
  },

  box: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    gap: 20,
    flexGrow: 1,
    alignItems: 'center',
  },

  contentContainerStyle: {
    width: '100%',
    gap: 20,
    paddingTop: 20,
  },
  boxText: {
    justifyContent: 'center',
    gap: 2,
  },

  text: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
  },

  subText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});
