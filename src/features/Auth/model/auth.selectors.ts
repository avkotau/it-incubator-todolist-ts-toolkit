import { AppRootStateType } from "common/store";
export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
