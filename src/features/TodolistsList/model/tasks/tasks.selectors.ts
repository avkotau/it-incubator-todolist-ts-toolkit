import { AppRootStateType } from "common/store";

export const selectTasks = (state: AppRootStateType) => state.tasks;
