import {createSlice} from '@reduxjs/toolkit';
import {colors} from '../../config';

const initialState = {
  theme: {
    theme: false,
    automatic: false,
    colors: {
      primary: colors.cinnabar,
      secondary: colors.bittersweet,
      body: colors.lightBody,
      text: colors.lightText,
      box: colors.boxLight,
    },

    icons: {
      variant: 'duotone',
    },
  },
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.theme.theme = action.payload;

      state.theme.colors.body = !state.theme.theme
        ? colors.darkBody
        : colors.lightBody;
      state.theme.colors.text = !state.theme.theme
        ? colors.darkText
        : colors.lightText;
      state.theme.colors.box = !state.theme.theme
        ? colors.boxDark
        : colors.boxLight;
    },

    changePrimaryColor: (state, action) => {
      state.theme.colors.primary = action.payload;
    },

    changeIconVariant: (state, action) => {
      state.theme.icons.variant = action.payload;
    },

    changeAutomatic: (state, action) => {
      state.theme.automatic = action.payload;
    },
  },
});

export const {
  changeTheme,
  changePrimaryColor,
  changeIconVariant,
  changeAutomatic,
} = themeSlice.actions;

export default themeSlice.reducer;
