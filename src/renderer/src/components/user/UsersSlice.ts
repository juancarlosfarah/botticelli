import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@renderer/store';

interface UserState {
  currentUser: string | null;
  sessionLoggedIn: boolean;
}

const initialState: UserState = {
  currentUser: null,
  sessionLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.currentUser = action.payload;
      state.sessionLoggedIn = true;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.sessionLoggedIn = false;
    },
    clearSession: (state) => {
      state.sessionLoggedIn = false;
    },
  },
});

export const { setCurrentUser, logoutUser, clearSession } = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectSessionLoggedIn = (state: RootState) =>
  state.user.sessionLoggedIn;

export default userSlice.reducer;
export type { UserState };
