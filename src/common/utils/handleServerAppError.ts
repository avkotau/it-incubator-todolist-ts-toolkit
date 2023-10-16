import { Dispatch } from "redux";
import { appActions } from "features/App/model/app.reducer";
import { BaseResponseType } from "common/types";

/**
 * Handles server application errors by setting an error and status in the application state.
 *
 * @template D Generic type for the data in the BaseResponseType
 * @param {BaseResponseType} data - The response data from the server which contains an array of messages.
 * @param {Dispatch} dispatch - The dispatch function used to dispatch actions to the Redux store.
 * @param {boolean} [showError=true] - A flag to determine if the error should be shown. By default, errors are shown.
 * @returns {void} Returns nothing. It's a side effect function to dispatch actions based on the server response.
 */
export const handleServerAppError = <D>(
  data: BaseResponseType<D>,
  dispatch: Dispatch,
  showError: boolean = true
  ): void => {
    if (showError) {
      if (data.messages.length) {
        dispatch(appActions.setAppError({ error: data.messages[0] }));
      } else {
        dispatch(appActions.setAppError({ error: "Some error occurred" }));
      }
    }
  }
