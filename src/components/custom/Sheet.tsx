/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, ReactNode, memo} from 'react';
import {
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
  BackHandler,
  View,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
} from 'react-native-gesture-handler';
import {CloseButton} from '../util/CloseButton';
import {ThemeType} from '../../types';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

interface CustomBottomSheetProps {
  children: ReactNode;
  height?: number;
  damping?: number;
  stiffness?: number;
  openModal?: boolean;
  theme: ThemeType | any;
  onClose: () => void;
  title?: string;
}

const Sheet: React.FC<CustomBottomSheetProps> = memo(
  ({
    children,
    height = 500,
    damping = 10,
    stiffness = 300,
    openModal = true,
    theme,
    title,
    onClose,
  }) => {
    const translateY = useSharedValue(SCREEN_HEIGHT);

    const closeModal = useCallback(() => {
      'worklet';
      translateY.value = withTiming(
        SCREEN_HEIGHT,
        {duration: 300},
        isFinished => {
          if (isFinished) {
            runOnJS(onClose)();
          }
        },
      );
    }, [onClose]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateY: translateY.value}],
      };
    });

    const gesture = useMemo(
      () =>
        Gesture.Pan()
          .onUpdate(event => {
            translateY.value = Math.max(0, event.translationY);
          })
          .onEnd(() => {
            if (translateY.value > height / 2) {
              closeModal();
            } else {
              translateY.value = withSpring(0, {
                damping,
                stiffness,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
              });
            }
          }),
      [height, closeModal, damping, stiffness],
    );

    useEffect(() => {
      if (openModal) {
        translateY.value = withTiming(0, {duration: 300});
      } else {
        closeModal();
      }

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          closeModal();
          return true;
        },
      );

      return () => backHandler.remove();
    }, [openModal, closeModal, translateY]);

    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={openModal}
        onRequestClose={closeModal}
        statusBarTranslucent>
        <GestureHandlerRootView style={styles.container}>
          <Pressable style={styles.backdrop} onPress={closeModal} />
          <GestureDetector gesture={gesture}>
            <View>
              <Animated.View style={[styles.indicator, animatedStyle]} />
              <Animated.View
                style={[
                  styles.bottomSheet,
                  animatedStyle,
                  {height, backgroundColor: theme.colors.body},
                ]}>
                <View style={styles.headerContainer}>
                  <Text
                    style={[
                      styles.headerTitle,
                      {
                        color: theme.colors.text,
                        backgroundColor: theme.colors.box,
                      },
                    ]}>
                    {title}
                  </Text>
                  <CloseButton action={closeModal} theme={theme} />
                </View>
                {children}
              </Animated.View>
            </View>
          </GestureDetector>
        </GestureHandlerRootView>
      </Modal>
    );
  },
);

export {Sheet};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: '#ffff',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  sheetDownIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 10,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },

  headerTitle: {
    fontSize: 20,
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 15,
    fontFamily: 'Poppins-SemiBold',
  },
});
