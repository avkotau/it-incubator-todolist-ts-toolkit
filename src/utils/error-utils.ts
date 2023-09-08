import { ResponseType } from "api/todolists-api";
import { Dispatch } from "redux";
import { appActions } from "app/app.reducer";
import axios from "axios";
import { AppDispatch } from "app/store";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppError({ error: "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};

export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch):void => {
  let errorMessage = "Some error occurred";

  // Checking for axios errors
  if (axios.isAxiosError(err)) {
    // err.response?.data?.message - for example, receiving tasks with an invalid todolistId
    // err?.message - for example, when creating a task in offline mode
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
    // Checking for native errors
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
    // Some strange case
  } else {
    errorMessage = JSON.stringify(err);
  }

  dispatch(appActions.setAppError({ error: errorMessage }));
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
