/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ThemeType} from '../../types';
import {Container} from '../util/Container';
import Icon from '../../components/util/Icon';
import {HeaderButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {Title} from '../../components';
import {Sheet} from '../../components/custom';
import RNFS from 'react-native-fs';
import {FlatList} from 'react-native-gesture-handler';

type Props = {
  route?: {
    params: {
      theme: ThemeType;
    };
  };

  navigation?: any;
};

interface HeaderButtonPropsComponent extends HeaderButtonProps {
  theme: ThemeType;
  setPresentation: (params: number) => void;
  presentation: number;
}

const headerRightItesm: any = [
  {name: 'GridViewIcon', presentation: 1},
  {name: 'ListViewIcon', presentation: 2},
];

const headerRight = ({
  theme,
  setPresentation,
  presentation,
}: HeaderButtonPropsComponent) => {
  const transparent = 'transparent';
  return (
    <View style={styles.headerRightIconsContainer}>
      {headerRightItesm.map((item: any, index: number) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => setPresentation(item.presentation)}
            style={[
              styles.headerRight,
              {
                backgroundColor:
                  presentation === item.presentation
                    ? theme.colors.box
                    : transparent,
              },
            ]}>
            <Icon
              name={item.name}
              size={22}
              color={theme.colors.text}
              theme={theme}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

type RenderProps = {
  item: any;
  theme: ThemeType;
  setIsOpen: (params: boolean) => void;
  navigation: any;
};

const RenderFolder = ({item, theme, setIsOpen, navigation}: RenderProps) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Folder', {item})}
      key={item.name}
      style={[styles.box, {backgroundColor: theme.colors.box}]}>
      <View style={styles.boxIcons}>
        <Icon
          name="Folder01Icon"
          size={25}
          color={theme.colors.text}
          theme={theme}
        />
        <TouchableOpacity onPress={() => setIsOpen(true)}>
          <Icon
            theme={theme}
            name="MoreVerticalCircle01Icon"
            size={25}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text
          numberOfLines={1}
          style={[styles.folderText, {color: theme.colors.text}]}>
          {item?.name}
        </Text>
        <View>
          <Text
            numberOfLines={1}
            style={[styles.folderSize, {color: theme.colors.text}]}>
            {item?.size} MB
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Files = ({route, navigation}: Props) => {
  const {theme} = route.params;
  const [presentation, setPresentation] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [folders, setFolders] = useState<any>([]);

  useEffect(() => {
    const listAppDirectory = async () => {
      try {
        const directoryPath = `${RNFS.ExternalStorageDirectoryPath}/Android/data/com.vela_app/files/Download/vela/`;
        const files = await RNFS.readDir(directoryPath);

        const Folders = files.filter(file => file.isDirectory());
        setFolders(Folders);
      } catch (error) {
        console.error('Error al leer el directorio:', error);
      }
    };

    listAppDirectory();
  }, []);

  console.log(folders);

  useEffect(() => {
    navigation.setOptions({
      headerRight: (props: HeaderButtonProps) =>
        headerRight({...props, theme, setPresentation, presentation}),
    });
  }, [theme, navigation, presentation]);

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.Header}>
          <Title
            title="Descargas"
            theme={theme}
            size={25}
            subTitle="Almacenamiento > Descargas"
          />
          <TouchableOpacity
            onPress={() => setIsOpen(true)}
            style={[styles.iconBox, {backgroundColor: theme.colors.box}]}>
            <Icon
              name="Settings02Icon"
              size={25}
              color={theme.colors.text}
              theme={theme}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <FlatList
            contentContainerStyle={styles.contentContainerStyle}
            columnWrapperStyle={{gap: 10}}
            numColumns={2}
            data={folders}
            renderItem={({item, index}) => (
              <RenderFolder
                navigation={navigation}
                item={item}
                theme={theme}
                key={index}
                setIsOpen={setIsOpen}
              />
            )}
          />
        </View>
      </View>

      {isOpen && (
        <Sheet
          openModal={isOpen}
          onClose={() => setIsOpen(false)}
          theme={theme}>
          <Text style={{color: 'red'}}>Files</Text>
        </Sheet>
      )}
    </Container>
  );
};

export {Files};

const styles = StyleSheet.create({
  headerRight: {
    padding: 10,
    borderRadius: 50,
  },

  headerRightIconsContainer: {
    flexDirection: 'row',
    gap: 9,
  },

  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 5,
  },

  Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  iconBox: {
    padding: 10,
    borderRadius: 50,
  },

  body: {
    flex: 1,
  },

  boxIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 9,
  },

  folderText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    width: '100%',
  },

  box: {
    width: '10%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    gap: 40,
    flexGrow: 1,
  },

  contentContainerStyle: {
    width: '100%',
  },

  folderSize: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    width: '100%',
  },
});
