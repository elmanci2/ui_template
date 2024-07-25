import {
  Dimensions,
  FlatList,
  Linking,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Container} from './util/Container';
import {useDispatch, useSelector} from 'react-redux';
import {changeTheme} from '../storage/slices/ThemeSlice';
import {RootState} from '../storage';
import Icon from '../components/util/Icon';
import {IconVariant, SettingCategory, SettingItem, ThemeType} from '../types';
import switchTheme from 'react-native-theme-switch-animation';
import {Sheet} from '../components/custom';
import {Share, Theme} from '../components';
import {FlatList as ReanimatedFlatList} from 'react-native-gesture-handler';
interface SettingsType {
  ChangeTheme: () => void;
  navigationAction: (route: string) => void;
  setting: any;
  modalAction: () => void;
}

class SettingItems {
  settings: SettingsType;
  theme: ThemeType;
  iconType: IconVariant;
  constructor(settings: any, theme: ThemeType) {
    this.settings = settings;
    this.theme = theme;
    this.iconType = !this.theme.theme ? 'solid' : 'stroke';
  }

  public getTopItems(): SettingCategory[] {
    return [
      {
        title: 'More',
        items: [
          {
            title: 'Descargas',
            subtitle: 'Activas',
            icon: 'Download04Icon',
            value: this.settings.setting.notifications,
            iconsType: this.iconType,
            actionType: 'navigation',
            route: 'Files',
            navigationAction: this.settings.navigationAction,
          },
          {
            title: 'Siguiendo',
            subtitle: 'Activas',
            icon: 'PlayListFavourite02Icon',
            value: this.settings.setting.notifications,
            iconsType: this.iconType,
            actionType: 'navigation',
            route: 'Folder',
            navigationAction: this.settings.navigationAction,
          },
          {
            title: 'Historial',
            subtitle: 'Activas',
            icon: 'TimeHalfPassIcon',
            value: this.settings.setting.notifications,
            iconsType: this.iconType,
            actionType: 'navigation',
            route: 'Folder',
            navigationAction: this.settings.navigationAction,
          },
          {
            title: 'Descargas',
            subtitle: 'Activas',
            icon: 'Download01Icon',
            value: this.settings.setting.notifications,
            iconsType: this.iconType,
            actionType: 'navigation',
            route: 'Folder',
            navigationAction: this.settings.navigationAction,
          },
        ],
      },
    ];
  }

  public getItems(): SettingCategory[] {
    return [
      {
        title: 'Sistema',
        items: [
          {
            title: 'Notificaciones',
            subtitle: 'Activas',
            icon: 'Notification02Icon',
            value: this.settings.setting.notifications,
            type: 'switch',
            iconsType: this.iconType,
            actionType: 'switch',
            route: null,
          },
        ],
      },

      {
        title: 'Tema',
        items: [
          {
            title: 'Tema',
            subtitle: this.theme.theme ? 'Oscuro' : 'Claro',
            icon: this.theme.theme ? 'Moon02Icon' : 'Sun03Icon',
            value: this.theme.theme,
            type: 'switch',
            switchAction: this.settings.ChangeTheme,
            iconsType: this.iconType,
            actionType: 'switch',
            route: null,
          },
          {
            title: 'Personalizar',
            subtitle: 'Personalizar',
            icon: 'PaintBoardIcon',
            value: false,
            type: 'arrow',
            modalAction: this.settings.modalAction,
            modalIdentify: 'Theme',
            iconsType: this.iconType,
            actionType: 'modal',
            route: null,
          },
        ],
      },

      {
        title: 'Redes',
        items: [
          {
            title: 'Telegram',
            subtitle: 'Telegram',
            icon: 'TelegramIcon',
            value: true,
            type: 'arrow',
            iconsType: this.iconType,
            actionType: 'link',
            route: 'https://t.me/velanovelas',
          },
          {
            title: 'Comparte',
            subtitle: 'Compartir',
            icon: 'Share01Icon',
            value: true,
            type: 'arrow',
            iconsType: this.iconType,
            actionType: 'modal',
            modalAction: this.settings.modalAction,
            route: null,
            modalIdentify: 'Share',
          },
        ],
      },

      {
        title: 'Aplicaciones',
        items: [
          {
            title: 'Reportar un error',
            subtitle: 'Reportar un error',
            icon: 'Alert02Icon',
            value: true,
            type: 'arrow',
            iconsType: this.iconType,
            actionType: 'navigation',
            navigationAction: this.settings.navigationAction,
            route: 'Reporting',
          },

          {
            title: 'Acerca de',
            subtitle: 'Acerca de la app',
            icon: 'InformationCircleIcon',
            value: true,
            type: 'arrow',
            navigationAction: this.settings.navigationAction,
            iconsType: this.iconType,
            actionType: 'navigation',
            route: 'ThisApp',
          },

          {
            title: 'Termos y condiciones',
            subtitle: 'Termos y condiciones',
            icon: 'Book02Icon',
            value: true,
            type: 'arrow',
            iconsType: this.iconType,
            actionType: 'navigation',
            route: 'Player',
            navigationAction: this.settings.navigationAction,
          },
        ],
      },
    ];
  }
}

const {height, width} = Dimensions.get('window');

const SettingScreen = ({navigation}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIdentify, setModalIdentify] = useState('Share');

  const dispatcher = useDispatch();
  const {
    theme: {theme},
    setting: {setting},
  } = useSelector((state: RootState) => state);

  const ChangeTheme = () => {
    switchTheme({
      switchThemeFunction: () => {
        dispatcher(changeTheme(!theme.theme));
      },
      animationConfig: {
        type: 'circular',
        duration: 300,
        startingPoint: {
          cxRatio: 0.5,
          cyRatio: 0.5,
        },
      },
    });
  };

  const navigationAction = (route: string) => {
    console.log(route);
    navigation.navigate(route);
  };

  const modalAction = (identify: string) => {
    setModalIdentify(identify);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const HandleTopPress = useCallback((item: SettingItem) => {
    if (item.actionType === 'navigation') {
      item?.navigationAction && item.navigationAction(item.route);
    }

    if (item.actionType === 'modal') {
      item?.modalAction && item.modalAction(item.modalIdentify ?? '');
    }

    if (item.actionType === 'link' && item.route) {
      Linking.openURL(item.route);
    }
  }, []);

  const items = new SettingItems(
    {ChangeTheme, navigationAction, setting, modalAction},
    theme,
  );

  return (
    <Container>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100, gap: 20}}
        data={[]}
        renderItem={() => null}
        ListEmptyComponent={
          <View style={styles.container}>
            <View style={styles.topContentContainer}>
              <ReanimatedFlatList
                data={items.getTopItems()}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                renderItem={({item, index}) => {
                  return (
                    <View key={index} style={styles.topRenderItem}>
                      <ReanimatedFlatList
                        columnWrapperStyle={styles.topColumnWrapperStyle}
                        contentContainerStyle={styles.topContentContainerStyle}
                        numColumns={2}
                        data={item.items}
                        renderItem={({item: Item, index: Index}) => {
                          return (
                            <TouchableOpacity
                              onPress={() => HandleTopPress(Item)}
                              key={Index}
                              style={[
                                styles.miniBox,
                                {backgroundColor: theme.colors.box},
                              ]}>
                              <Icon
                                theme={theme}
                                name={Item.icon}
                                size={25}
                                color={theme.colors.text}
                              />
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.boxTitle,
                                  {color: theme.colors.text},
                                  styles.topItemsText,
                                ]}>
                                {Item.title}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  );
                }}
              />
              <FlatList
                style={styles.contentContainer}
                data={items.getItems()}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={[styles.box, {backgroundColor: theme.colors.box}]}
                      key={index}>
                      <Text
                        style={[styles.boxTitle, {color: theme.colors.text}]}>
                        {item.title}
                      </Text>

                      <FlatList
                        data={item.items}
                        renderItem={({item: Item, index: Index}) => {
                          return (
                            <TouchableOpacity
                              onPress={() => HandleTopPress(Item)}
                              activeOpacity={Item.type === 'switch' ? 1 : 0.5}
                              style={styles.boxContainer}
                              key={Index}>
                              <View style={styles.boxItem}>
                                <View style={styles.boxItemElements}>
                                  <View style={styles.boxIconContainer}>
                                    <Icon
                                      theme={theme}
                                      name={Item.icon}
                                      size={25}
                                      color={theme.colors.text}
                                      variant={Item.iconsType}
                                    />
                                  </View>
                                  <View style={styles.boxTextsContainer}>
                                    <Text
                                      style={[
                                        styles.TextItem2,
                                        {color: theme.colors.text},
                                      ]}>
                                      {Item.subtitle}
                                    </Text>
                                  </View>
                                </View>
                                <View style={styles.boxSwitch}>
                                  {Item.type === 'switch' ? (
                                    <Switch
                                      trackColor={{
                                        false: 'grey',
                                        true: theme.colors.primary,
                                      }}
                                      thumbColor={theme.colors.primary}
                                      ios_backgroundColor={theme.colors.box}
                                      value={!Item.value}
                                      onValueChange={() => {
                                        Item?.switchAction &&
                                          Item.switchAction();
                                      }}
                                    />
                                  ) : (
                                    <View style={styles.boxArrow}>
                                      <Icon
                                        theme={theme}
                                        name={'ArrowRight01Icon'}
                                        size={25}
                                        color={theme.colors.text}
                                      />
                                    </View>
                                  )}
                                </View>
                              </View>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  );
                }}
              />
            </View>
            {isModalOpen && (
              <Sheet
                height={modalIdentify === 'Share' ? 350 : height - 5}
                title={modalIdentify === 'Share' ? 'Compartir' : 'Personalizar'}
                openModal={isModalOpen}
                onClose={closeModal}
                theme={theme}>
                {modalIdentify === 'Share' ? (
                  <Share
                    message="hola"
                    title="comoestas"
                    url="http:juana.com"
                    theme={theme}
                  />
                ) : (
                  <Theme closeModal={closeModal} theme={theme} />
                )}
              </Sheet>
            )}
          </View>
        }
      />
    </Container>
  );
};

export {SettingScreen};

const styles = StyleSheet.create({
  boxTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  container: {
    width: '100%',
    marginTop: 10,
  },

  contentContainer: {
    flex: 1,
    gap: 10,
  },

  contendContainer: {
    gap: 20,
    paddingHorizontal: 6,
  },

  box: {
    width: '100%',
    borderRadius: 10,
    padding: 5,
  },
  boxContainer: {
    marginVertical: 13,
  },

  boxTextsContainer: {
    gap: -5,
    width: '100%',
  },

  TextItem2: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },

  TextItem1: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },

  boxItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  boxIconContainer: {},

  boxItemElements: {
    flexDirection: 'row',
    width: '50%',
    gap: 10,
    alignItems: 'center',
  },

  boxSwitch: {},

  boxArrow: {
    borderRadius: 30,
  },

  //todo :  styles for top items setting
  topContentContainer: {
    width: '100%',
    gap: 15,
  },
  topContentContainerStyle: {
    gap: 15,
  },
  miniBox: {
    width: width / 2.5,
    borderRadius: 10,
    padding: 10,
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 35,
  },
  topRenderItem: {
    width: '100%',
  },
  topColumnWrapperStyle: {
    gap: 15,
    paddingHorizontal: 6,
  },

  topItemsText: {
    width: '80%',
  },
});
