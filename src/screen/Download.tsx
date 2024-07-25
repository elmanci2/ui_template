import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNFS from 'react-native-fs';
import {Container} from './util/Container';
const Download = ({navigation}: any) => {
  const [folders, setFolders] = useState<any>([]);
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [filePath, setFilePath] = useState<any>(null);

  useEffect(() => {
    const listAppDirectory = async () => {
      try {
        const directoryPath = `${RNFS.ExternalStorageDirectoryPath}/Android/data/com.vela_app/files/Download/vela/`;
        const files = await RNFS.readDir(directoryPath);

        const folders = files.filter(file => file.isDirectory());

        console.log(
          'Carpetas en el directorio:',
          folders.map(folder => folder.name),
        );

        setFolders(folders);
      } catch (error) {
        console.error('Error al leer el directorio:', error);
      }
    };

    listAppDirectory();
  }, []);

  const navigateFolder = async (folder: any) => {
    setSelectedFolder(folder);
    if (selectedFolder) {
      const phat = await RNFS.readDir(folder.path);
      const files = phat.filter(file => file.isFile());
      setFolders(files);
      if (files.length > 0) {
        setFilePath(files[0].path);
        navigation.navigate('Player', {file: files[0].path});
      }
    }
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity key={item.name} onPress={() => navigateFolder(item)}>
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Container>
      <View style={styles.container}>
        <FlatList
          data={folders}
          renderItem={renderItem}
          keyExtractor={item => item.name}
        />
      </View>
    </Container>
  );
};

export {Download};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },

  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
