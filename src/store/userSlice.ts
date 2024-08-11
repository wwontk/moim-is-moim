import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {
    uid: "",
    email: "",
    photoURL: "",
    displayName: "",
    isLogin: false,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser.uid = action.payload.uid;
      state.currentUser.email = action.payload.email;
      state.currentUser.photoURL = action.payload.photoURL;
      state.currentUser.displayName = action.payload.displayName;
      state.currentUser.isLogin = true;
    },
    clearUser: (state) => {
      state.currentUser.uid = "";
      state.currentUser.email = "";
      state.currentUser.photoURL = "";
      state.currentUser.displayName = "";
      state.currentUser.isLogin = false;
    },
    setPhotoURL: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        photoURL: action.payload,
      };
    },
  },
});

export const { setPhotoURL, clearUser, setUser } = userSlice.actions;

export default userSlice.reducer;
