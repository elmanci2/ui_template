import {NativeModules, StyleSheet, Button, TextInput} from 'react-native';
import React, {useState} from 'react';
import {Container} from './util/Container';

const Home = ({navigation}: any) => {
  const {DownloadModule} = NativeModules;
  const [uri, setUrl] = useState<string>(
    'https://xhisossxof6ziadr.sw-cdnstreamwish.com/v/01/03524/brb4gso4q3rp_n/3969_1.mp4?t=1QJGu2Y39J-7UqBoTtbKPWtkPHcjleN1P6KedzeglqY&s=1720649239&e=129600&f=17622554&sp=400&i=0.0',
  );
  const [foldername, setFoldername] = useState<string>(
    'Tokidoki Bosotto Russia-go ',
  );

  //random file name for

  const randomFileName = Math.random().toString(36).substring(2, 15);
  const create = () => {
    DownloadModule.downloadVideo(
      uri,
      'Big Buck Bunny',
      randomFileName + 'test.mp4',
      foldername,
      (error: string, filePath: string) => {
        if (error) {
          console.error('Download failed:', error);
        } else {
          console.log('Download complete:', filePath);
        }
      },
    );
  };

  return (
    <Container>
      <TextInput
        placeholder="Url"
        value={uri}
        onChangeText={setUrl}
        placeholderTextColor={'red'}
        style={{width: '100%', height: 40, borderColor: 'red', color: 'red'}}
      />
      <TextInput
        placeholder="Folder Name"
        value={foldername}
        onChangeText={setFoldername}
        placeholderTextColor={'red'}
        style={{width: '100%', height: 40, borderColor: 'red', color: 'red'}}
      />
      <Button onPress={create} title="Download" />
      <Button
        onPress={() => navigation.navigate('Download')}
        title="navigation.navigate('Download')"
      />
    </Container>
  );
};

export {Home};

const styles = StyleSheet.create({});
