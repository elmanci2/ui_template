/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Video, {ReactVideoProps, ResizeMode, VideoRef} from 'react-native-video';
import Icon from '../components/util/Icon';
import {Slider} from '@miblanchard/react-native-slider';
import {useSelector} from 'react-redux';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import PipHandler, {usePipModeListener} from 'react-native-pip-android';
import {RootState} from '../storage';
import {icons} from 'ui-react-native-icos';
import {colors} from '../config';
import {Alert} from '../components';

const IconsStyles = {
  size: 40,
  color: 'white',
  iconsVariant: 'solid',
  moreIconStyle: {
    size: 30,
  },
};

type MoreActionIcons = {
  title: string;
  onPress: any;
  icon: keyof typeof icons;
};

class MoreActions {
  private videoRef: VideoRef;
  private setResizeMode: any;
  private resizeMode: ResizeMode;
  private setLock: any;
  private lock: boolean;
  private Alerta: boolean;
  private setAlert: any;
  private setIsPlaying: any;
  private isPlaying: boolean;
  private setMuted: any;
  private muted: boolean;
  private setIsVideoAt95Percent: any;
  private isVideoAt95Percent: boolean;
  private inPipMode: boolean;
  constructor(videoRef: VideoRef, props: any) {
    this.videoRef = videoRef;
    this.setResizeMode = props.setResizeMode;
    this.resizeMode = props.resizeMode;
    this.setLock = props.setLock;
    this.lock = props.lock;
    this.Alerta = props.Alerta;
    this.setAlert = props.setAlert;
    this.setIsPlaying = props.setIsPlaying;
    this.isPlaying = props.isPlaying;
    this.setMuted = props.setMuted;
    this.muted = props.muted;
    this.setIsVideoAt95Percent = props.setIsVideoAt95Percent;
    this.isVideoAt95Percent = props.isVideoAt95Percent;
    this.inPipMode = props.inPipMode;
  }

  private setToggleFullScreen = () => {
    if (this.resizeMode === 'none') {
      this.setResizeMode('cover');
    } else {
      this.setResizeMode('none');
    }
  };

  private setToggleBlock = () => {
    this.setLock(!this.lock);
  };

  public PictureInPicture = () => {
    PipHandler.enterPipMode(500, 314);

    if (!this.inPipMode) {
      this.setIsVideoAt95Percent(false);
    }
  };

  public changeAlert = ({type = null}: any) => {
    if (this.isPlaying) {
      this.setIsPlaying(false);
    }
    if (type === 'close') {
      this.setIsPlaying(true);
    }
    this.setAlert(!this.Alerta);
  };

  public MoreItems(): MoreActionIcons[] {
    return [
      {
        title: 'Fullscreen',
        onPress: this.setToggleFullScreen,
        icon:
          this.resizeMode === 'none'
            ? 'SquareArrowExpand02Icon'
            : 'SquareArrowShrink01Icon',
      },
      {
        title: 'Velocidad',
        onPress: this.changeAlert,
        icon: 'Timer02Icon',
      },
      {
        title: 'PIP',
        onPress: this.PictureInPicture,
        icon: 'MinimizeScreenIcon',
      },
      {
        title: 'Bloquear',
        onPress: this.setToggleBlock,
        icon: !this.lock ? 'SquareLock01Icon' : 'SquareUnlock01Icon',
      },
    ];
  }

  private setMute = () => {
    this.setMuted(!this.muted);
  };

  private setCast = () => {};

  public MoreTopActions = (): MoreActionIcons[] => {
    return [
      {
        title: 'Muted',
        icon: this.muted ? 'VolumeHighIcon' : 'VolumeOffIcon',
        onPress: this.setMute,
      },
      {
        title: 'cast',
        onPress: this.setCast,
        icon: 'MirroringScreenIcon',
      },
    ];
  };
}

const Player = ({navigation, route}: {navigation: any; route: any}) => {
  const {file} = route?.params;
  const {theme} = useSelector((state: RootState) => state.theme);
  const inPipMode = usePipModeListener();
  const videoRef = useRef<VideoRef>(null as any);
  const [resizeMode, setResizeMode] =
    useState<ReactVideoProps['resizeMode']>('none');
  const [lock, setLock] = useState(false);
  const [Alerta, setAlert] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [pipMode, setPipMode] = useState(true);
  const [isVideoAt95Percent, setIsVideoAt95Percent] = useState(false);
  const [active, setActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [hiddenControls, setHiddenControls] = useState(false);

  // shared values
  const opacity = useSharedValue(1);
  const translateYTop = useSharedValue(0);
  const translateYBottom = useSharedValue(0);
  const nextAnimation = useSharedValue(0);
  const backgroundColor = useSharedValue('rgba(0, 0, 0, 0.57)');
  //todo: animation styles
  const nextAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(nextAnimation.value, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });
  const translateYBottomStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateYBottom.value,
        },
      ],
    };
  });

  const translateYTopStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateYTop.value,
        },
      ],
    };
  });

  const animatedStyleBackground = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 500,
      }),
    };
  });

  // todo:instances
  const moreActions = new MoreActions(videoRef.current, {
    lock,
    resizeMode,
    setResizeMode,
    setLock,
    Alerta,
    setAlert,
    setIsPlaying,
    isPlaying,
    setMuted,
    muted,
    navigation,
    setIsVideoAt95Percent,
    isVideoAt95Percent,
    inPipMode,
  });

  const background =
    'https://dulisv62.sw-cdnstreamwish.com/hls2/01/04323/f29kzuo689uw_,n,h,.urlset/master.m3u8?t=6pj54gUTOVLgi0rDt-nlzeQ2i-cicVuYr54NNlIGZuY&s=1720401414&e=129600&f=21618840&srv=e9ccawf5esyyffhp&i=0.4&sp=500&p1=e9ccawf5esyyffhp&p2=e9ccawf5esyyffhp&asn=52468';

  let timeout: NodeJS.Timeout | undefined;

  //todo: methods
  const onPauseAndPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const onSeek = async (time: number) => {
    if (videoRef.current) {
      videoRef.current?.seek(time);
      setCurrentTime(time);
    }
  };

  const onRewind = () => {
    const newTime = Math.min(currentTime - 10, duration);
    onSeek(newTime);
    clearTimeout(timeout);
  };

  const onFastForward = () => {
    const newTime = Math.min(currentTime + 10, duration);
    onSeek(newTime);
    clearTimeout(timeout);
  };
  const onProgress = (data: any) => {
    setCurrentTime(data.currentTime);
    if (
      !inPipMode &&
      data.currentTime / duration >= 0.92 &&
      !isVideoAt95Percent
    ) {
      nextAnimation.value = withTiming(1, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });
      setIsVideoAt95Percent(true);
    } else if (
      !inPipMode &&
      data.currentTime / duration < 0.92 &&
      isVideoAt95Percent
    ) {
      nextAnimation.value = withTiming(0, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });
      setIsVideoAt95Percent(false);
    }
  };
  const onLoad = (data: any) => {
    setDuration(data.duration);
  };
  const onBuffer = (data: any) => {
    setBuffering(data.isBuffering);
  };

  //todo:utils
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const trackMarks = [0.5, 0.75, 1, 1.25, 1.5];
  const handleSliderChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  function calcularValor(n: number): number {
    return 0.5 + (n - 1) * 0.25;
  }

  const hiddenTranslateTop = () => {
    opacity.value = 0;
    translateYTop.value = withTiming(-100, {
      duration: 500,
    });
    translateYBottom.value = withTiming(100, {
      duration: 500,
    });
    setHiddenControls(true);
  };

  const hiddenTranslateBottom = () => {
    setTimeout(() => {
      opacity.value = 1;
      translateYTop.value = withTiming(0, {
        duration: 500,
      });
      translateYBottom.value = withTiming(0, {
        duration: 500,
      });

      setHiddenControls(false);
    }, 100);
  };

  //todo: useEffect
  useEffect(() => {
    if (active) {
      hiddenTranslateTop();
    } else {
      hiddenTranslateBottom();
    }
  }, [active]);

  useEffect(() => {
    if (inPipMode) {
      hiddenTranslateTop();
      setActive(true);
      setPipMode(true);
    }
  }, [inPipMode]);

  useEffect(() => {
    if (isPlaying && !active) {
      timeout = setTimeout(() => {
        setActive(true);
        setHiddenControls(true);
        if (active) {
          hiddenTranslateTop();
        }
      }, 6000); // <== 6 segundos
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isPlaying, active]);

  useEffect(() => {
    if (inPipMode) {
      setIsVideoAt95Percent(false);
    }
  }, [inPipMode]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' && !isPlaying) {
        moreActions.PictureInPicture();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    backgroundColor.value = withTiming(
      !active ? 'rgba(0, 0, 0, 0.57)' : 'transparent',
      {duration: 500},
    );
  }, [active]);

  return (
    <View style={styles.container}>
      <Alert
        visible={Alerta}
        title="Velocidad"
        onPress={() => moreActions.changeAlert({type: 'close'})}
        theme={theme}>
        <View style={styles.sliderContainer}>
          <View style={styles.trackMarkContainer}>
            {trackMarks.map(mark => (
              <Text
                key={mark}
                style={[
                  styles.trackMarkText,
                  {color: theme.colors.text, backgroundColor: theme.colors.box},
                ]}>
                {`${mark}x ${mark === 1 ? '(Normal)' : ''}`}
              </Text>
            ))}
          </View>
          <Slider
            value={speed}
            onValueChange={handleSliderChange}
            minimumValue={1}
            maximumValue={5}
            step={1}
            trackMarks={trackMarks}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.box}
            thumbTintColor={theme.colors.primary}
            containerStyle={styles.sliderSpeed}
            trackClickable
          />
        </View>
      </Alert>
      <Animated.View
        style={[styles.controlsContainer, animatedStyleBackground]}>
        <Pressable
          style={[styles.controlsContainer]}
          onPress={() => setActive(!active)}>
          <Animated.View style={[styles.controlsTop, translateYTopStyle]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                theme={theme}
                name="ArrowLeft01Icon"
                size={IconsStyles.size}
                color={IconsStyles.color}
              />
            </TouchableOpacity>

            <Text style={styles.time}>la Rosa de guadalupe</Text>

            <View>
              <FlatList
                data={moreActions.MoreTopActions()}
                horizontal
                contentContainerStyle={{gap: 10}}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={item.onPress}
                    key={item.title}
                    style={[
                      styles.moreAction,
                      {backgroundColor: colors.boxDark},
                    ]}>
                    <Icon
                      theme={theme}
                      name={item.icon}
                      size={IconsStyles.moreIconStyle.size}
                      color={IconsStyles.color}
                      variant={IconsStyles.iconsVariant}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          </Animated.View>
          {!hiddenControls && (
            <Animated.View style={[styles.controlsMedium, animatedStyle]}>
              <TouchableOpacity onPress={onRewind}>
                <Icon
                  theme={theme}
                  name="PreviousIcon"
                  size={IconsStyles.size}
                  color={IconsStyles.color}
                  variant={IconsStyles.iconsVariant}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onPauseAndPlay}
                style={styles.playPause}>
                {buffering ? (
                  <ActivityIndicator size={IconsStyles.size} color="white" />
                ) : isPlaying ? (
                  <Icon
                    theme={theme}
                    name="PauseIcon"
                    size={IconsStyles.size}
                    color={IconsStyles.color}
                    variant={IconsStyles.iconsVariant}
                  />
                ) : (
                  <Icon
                    theme={theme}
                    name="PlayIcon"
                    size={IconsStyles.size}
                    color={IconsStyles.color}
                    variant={IconsStyles.iconsVariant}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={onFastForward}>
                <Icon
                  theme={theme}
                  name="NextIcon"
                  size={IconsStyles.size}
                  color={IconsStyles.color}
                  variant={IconsStyles.iconsVariant}
                />
              </TouchableOpacity>
            </Animated.View>
          )}

          <View style={styles.controlsBottom}>
            {isVideoAt95Percent && (
              <Animated.View style={[styles.nextEpisode, nextAnimationStyle]}>
                <TouchableOpacity style={styles.nextEpisodeItem}>
                  <Text style={styles.nextEpisodeText}>Próximo</Text>
                  <Icon
                    theme={theme}
                    name="ArrowRight03Icon"
                    size={IconsStyles.size}
                    color={colors.boxDark}
                  />
                </TouchableOpacity>
              </Animated.View>
            )}

            {!hiddenControls && (
              <Animated.View style={[styles.progressBar, animatedStyle]}>
                <Text style={styles.time}>{formatTime(currentTime)}</Text>
                <Slider
                  value={currentTime}
                  minimumValue={0}
                  maximumValue={duration}
                  thumbTintColor={theme.colors.primary}
                  minimumTrackTintColor={theme.colors.primary}
                  onValueChange={value =>
                    onSeek(Array.isArray(value) ? value[0] : value)
                  }
                  containerStyle={styles.slider}
                />
                <Text style={styles.time}>{formatTime(duration)}</Text>
              </Animated.View>
            )}

            <Animated.View style={[styles.moreActions, translateYBottomStyle]}>
              <FlatList
                contentContainerStyle={styles.contentContainerStyle}
                horizontal
                data={moreActions.MoreItems()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={item.onPress}
                    key={item.title}
                    style={[
                      styles.moreAction,
                      {backgroundColor: colors.boxDark},
                    ]}>
                    <Icon
                      theme={theme}
                      name={item.icon}
                      size={IconsStyles.moreIconStyle.size}
                      color={IconsStyles.color}
                      variant={IconsStyles.iconsVariant}
                    />
                    <Text style={styles.moreActionText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            </Animated.View>
          </View>
        </Pressable>
      </Animated.View>

      <StatusBar hidden animated translucent />
      <Video
        volume={1}
        resizeMode={resizeMode}
        source={{uri: file, headers: {Referer: 'https://luluvdo.com'}}}
        ref={videoRef}
        paused={!isPlaying}
        onProgress={onProgress}
        onLoad={onLoad}
        style={styles.backgroundVideo}
        onBuffer={onBuffer}
        rate={calcularValor(speed)}
        playInBackground
        muted={muted}
        bufferConfig={{
          minBufferMs: 15000,
          maxBufferMs: 20000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 5000,
        }}
        pictureInPicture={pipMode ? true : false}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  controlsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },

  controlsMedium: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  controlsTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },

  controlsBottom: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
  },

  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },

  time: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins-BoldItalic',
  },

  slider: {
    width: '67%',
  },
  playPause: {},
  moreActions: {
    flexDirection: 'row',
    gap: 15,
  },
  contentContainerStyle: {
    width: '100%',
    justifyContent: 'center',
    gap: 20,
  },
  moreAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },

  moreActionText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },

  /// SLIDER  sped
  speedText: {
    marginTop: 20,
    fontSize: 18,
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  trackMarkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  trackMarkText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    padding: 4,
    borderRadius: 10,
  },

  sliderSpeed: {
    width: '100%',
  },

  nextEpisodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },

  nextEpisode: {
    position: 'absolute',
    borderRadius: 10,
    bottom: '100%',
    right: '8%',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  nextEpisodeText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
  },
});

export {Player};
