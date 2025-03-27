import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@renderer/store';

interface UserState {
  currentUser: string | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.currentUser = action.payload;
    },
    logoutUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, logoutUser } = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;

export default userSlice.reducer;
