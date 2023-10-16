import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "features/App/model/app.reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from "common/utils";
import { authAPI } from "features/Auth/api/authApi";
import { ResultCode } from "common/enums";
import { BaseResponseType } from "common/types";
import { LoginParamsType } from "features/Auth/ui/login/Login";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    captcha: ''
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
      })
      .addCase(getCaptcha.fulfilled, (state, action) => {
        debugger
        state.captcha = action.payload.captcha;
      });
  }
});

// thunks
export const getCaptcha = createAppAsyncThunk<{ captcha: string }, undefined>(
  "Auth/captcha",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await authAPI.security();

      return { captcha: res.data.url };

    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);
export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType, {
  rejectValue: BaseResponseType | null
}>(
  "Auth/login",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await authAPI.login(arg);
      if (res.data.resultCode === ResultCode.success) {
        return { isLoggedIn: true };
      } else {
        const isShowAppError = !res.data.fieldsErrors.length;

        if (!!res.data.fieldsErrors.length) {
          dispatch(getCaptcha());
        }

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
  "Auth/logout",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await authAPI.logout();
      if (res.data.resultCode === ResultCode.success) {
        dispatch(clearTasksAndTodolists());
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
  "Auth/initializeApp",
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
