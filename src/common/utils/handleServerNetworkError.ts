import { appActions } from "app/app.reducer";
import axios from "axios";
import { AppDispatch } from "app/store";

export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch): void => {
  let errorMessage = "Some error occurred";
  if (axios.isAxiosError(err)) {
    // err.response?.data?.message - for example, receiving tasks with an invalid todolistId
    // err?.message - for example, when creating a task in offline mode
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
  } else {
    errorMessage = JSON.stringify(err);
  }
  dispatch(appActions.setAppError({ error: errorMessage }));
};
