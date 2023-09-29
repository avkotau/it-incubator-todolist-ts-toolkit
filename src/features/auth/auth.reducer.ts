import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app.reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from "common/utils";
import { authAPI } from "features/auth/authApi";
import { ResultCode } from "common/enums";
import { BaseResponseType } from "common/types";
import { LoginParamsType } from "features/auth/Login";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  }
});

// thunks
export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType, {
  rejectValue: BaseResponseType | null
}>(
  "auth/login",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await authAPI.login(arg);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        const isShowAppError = !res.data.fieldsErrors.length;
        handleServerAppError(res.data, dispatch, isShowAppError);
        return rejectWithValue(res.data);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "auth/logout",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await authAPI.logout();
      if (res.data.resultCode === ResultCode.success) {
        dispatch(clearTasksAndTodolists());
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: false };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "auth/initializeApp",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.me();
      if (res.data.resultCode === ResultCode.success) {
        return { isLoggedIn: true };
      } else {
        return rejectWithValue(null);
      }
    })
      .finally(() => {
        dispatch(appActions.setAppInitialized({ isInitialized: true }));
      });
  }
);

export const authReducer = slice.reducer;
export const authThunks = { login, logout, initializeApp };
