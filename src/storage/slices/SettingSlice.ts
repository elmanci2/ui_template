import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  setting: {
    notifications: true,
    telegram: true,
    share: true,
  },
};

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    changeNotifications: state => {
      state.setting.notifications = !state.setting.notifications;
    },
  },
});

export const {changeNotifications} = settingSlice.actions;

export default settingSlice.reducer;
