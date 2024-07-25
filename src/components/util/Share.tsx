import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Vibration,
} from 'react-native';
import React, {memo} from 'react';
import share from 'react-native-share';
import {icons} from 'ui-react-native-icos';
import {ThemeType} from '../../types';
import {FlatList} from 'react-native-gesture-handler';
import Icon from './Icon';
import Clipboard from '@react-native-clipboard/clipboard';
type ShareConstructor = {
  message: string;
  url: string;
  title: string;
};

type SocialMediaShareType = {
  name: string;
  icon: keyof typeof icons;
  onPress: () => void;
  color: string;
};

class ShareOptions {
  private message: string;
  private url: string;
  private title: string;
  constructor({message, url, title}: ShareConstructor) {
    this.message = message;
    this.url = url;
    this.title = title;
  }

  public async onShare({social}: any) {
    await share.shareSingle({
      message: this.message,
      url: this.url,
      title: this.title,
      social,
    });
  }

  public async copyLink() {
    Clipboard.setString(this.url);
    console.log(this.url);
    Vibration.vibrate(100);
    ToastAndroid.show('Link copiado', ToastAndroid.BOTTOM);
  }

  public async MoreOptionShare() {
    await share.open({
      url: this.url,
      title: this.title,
      message: this.message,
    });
  }

  public BigShare(): SocialMediaShareType[] {
    return [
      {
        name: 'Facebook',
        icon: 'Facebook01Icon',
        color: '#3b5998',
        onPress: () => this.onShare({social: share.Social.FACEBOOK}),
      },
      {
        name: 'Telegram',
        icon: 'TelegramIcon',
        color: '#0088cc',
        onPress: () => this.onShare({social: share.Social.TELEGRAM}),
      },
      {
        name: 'Whatsapp',
        icon: 'WhatsappIcon',
        color: '#25d366',
        onPress: () => this.onShare({social: share.Social.WHATSAPP}),
      },
    ];
  }

  public socialMediaShare(): SocialMediaShareType[] {
    return [
      {
        name: 'x',
        icon: 'NewTwitterIcon',
        color: '#1da1f2',
        onPress: () => this.onShare({social: share.Social.TWITTER}),
      },
      {
        name: 'discord',
        icon: 'DiscordIcon',
        color: '#7289da',
        onPress: () => this.onShare({social: share.Social.DISCORD}),
      },
      {
        name: 'Instagram',
        icon: 'InstagramIcon',
        color: '#e4405f',
        onPress: () => this.onShare({social: share.Social.INSTAGRAM}),
      },
      {
        name: 'linkedin',
        icon: 'Linkedin02Icon',
        color: '#3b5998',
        onPress: () => this.onShare({social: share.Social.LINKEDIN}),
      },
      {
        name: 'Email',
        icon: 'MailUpload01Icon',
        color: '#f48024',
        onPress: () => this.onShare({social: share.Social.EMAIL}),
      },
      {
        name: 'more',
        icon: 'MoreHorizontalCircle01Icon',
        color: '#f48024',
        onPress: () => this.MoreOptionShare(),
      },
    ];
  }
}

const Share = memo(
  ({message, url, title, theme}: ShareConstructor & {theme: ThemeType}) => {
    const shareOptions = new ShareOptions({message, url, title});
    return (
      <View style={[styles.container]}>
        <View style={[styles.row, {backgroundColor: theme.colors.box}]}>
          <View style={styles.subRow}>
            <Icon
              name="Unlink03Icon"
              size={30}
              color={theme.colors.text}
              theme={theme}
            />
            <Text style={[styles.textCopy, {color: theme.colors.text}]}>
              Copiar link
            </Text>
          </View>
          <TouchableOpacity onPress={shareOptions.copyLink}>
            <Icon
              name="Copy01Icon"
              size={30}
              color={theme.colors.text}
              theme={theme}
            />
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={styles.contentContainerStyle}
            data={shareOptions.socialMediaShare()}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={item.onPress}
                style={[
                  styles.socialItem,
                  {backgroundColor: theme.colors.box},
                ]}>
                <View>
                  <Icon
                    name={item.icon}
                    size={30}
                    color={item.color}
                    theme={theme}
                  />
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.name}
          />
        </View>
        <View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={[styles.contentContainerStyle, styles.gap]}
            data={shareOptions.BigShare()}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={item.onPress}
                style={[
                  styles.socialItem,
                  {backgroundColor: theme.colors.box},
                ]}>
                <View>
                  <Icon
                    name={item.icon}
                    size={80}
                    color={item.color}
                    theme={theme}
                  />
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.name}
          />
        </View>
      </View>
    );
  },
);

export {Share};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
  },
  contentContainerStyle: {
    paddingVertical: 10,
    gap: 10,
  },

  socialItem: {
    padding: 10,
    borderRadius: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 10,
    alignItems: 'center',
  },

  subRow: {
    flexDirection: 'row',
    gap: 7,
  },

  textCopy: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
  },
  gap: {
    gap: 16,
  },
});
