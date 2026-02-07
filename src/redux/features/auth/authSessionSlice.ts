import { createSlice } from "@reduxjs/toolkit";

type AuthSessionState = {
  hasSession: boolean;
};

const getInitialSession = (): boolean => {
  try {
    return localStorage.getItem("sr_has_session") === "1";
  } catch {
    return false;
  }
};

const initialState: AuthSessionState = {
  hasSession: getInitialSession(),
};

const authSessionSlice = createSlice({
  name: "authSession",
  initialState,
  reducers: {
    setSession(state) {
      state.hasSession = true;
    },
    clearSession(state) {
      state.hasSession = false;
    },
  },
});

export const { setSession, clearSession } = authSessionSlice.actions;
export default authSessionSlice.reducer;
