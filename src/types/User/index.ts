export interface ValidCheckType {
  status: boolean;
  msg: string;
}

export interface RootState {
  user: {
    currentUser: {
      uid: string;
      email: string;
      displayName: string;
      photoURL: string;
      isLogin: boolean;
    };
  };
}
