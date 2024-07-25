/* import {configureStore} from '@reduxjs/toolkit';
import themeSlice from './slices/ThemeSlice';
import settingSlice from './slices/SettingSlice';

const store = configureStore({
  reducer: {
    theme: themeSlice,
    setting: settingSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
 */

import {configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import themeSlice from './slices/ThemeSlice';
import settingSlice from './slices/SettingSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedThemeReducer = persistReducer(persistConfig, themeSlice);
const persistedSettingReducer = persistReducer(persistConfig, settingSlice);

const store = configureStore({
  reducer: {
    theme: persistedThemeReducer,
    setting: persistedSettingReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
