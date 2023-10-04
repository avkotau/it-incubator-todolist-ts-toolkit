import { AppDispatch, AppRootStateType } from 'common/store';
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { BaseResponseType} from 'common/types';
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";

/**
 * A utility function for executing thunk logic within a try-catch block, ensuring
 * consistent App state handling during async operations.
 *
 * @template T The type of the value that the Promise will resolve to.
 *
 * @param {BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>} thunkAPI
 * - The thunk API object provided by Redux Toolkit's createAsyncThunk.
 * @param {() => Promise<T>} logic - The async logic function to be executed.
 *
 * @returns {Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>>}
 * - Returns a promise that resolves to the result of the logic function or to a rejection value if an error occurs.
 *
 */
export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>,
  logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    return await logic();
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
};
