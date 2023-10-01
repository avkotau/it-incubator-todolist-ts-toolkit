import { todosThunks } from "features/TodolistsList/model/todolists/todolists.reducer";
import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from "common/utils";
import { ResultCode, TaskPriorities, TaskStatuses } from "common/enums";
import { tasksApi } from "features/TodolistsList/api/tasksApi";
import {
  AddTaskArg,
  RemoveTaskArg,
  TaskType,
  UpdateTaskArg,
  UpdateTaskModelType
} from "features/TodolistsList/api/tasksApi.types";

const initialState: TasksStateType = {};

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  //allows you to create a reducer handler without creating an action
  // 1. when we work with thunks
  // 2. when the state is in one reducer, and the action in another
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId];
        tasks.unshift(action.payload.task);
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) tasks.splice(index, 1);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel };
        }
      })
      .addCase(todosThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todosThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todosThunks.fetchTodos.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
  }
});

// thunks
const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasks",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await tasksApi.getTasks(todolistId);
      const tasks = res.data.items;
      return { tasks, todolistId };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArg>(
  "tasks/addTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await tasksApi.createTask(arg);
      if (res.data.resultCode === ResultCode.success) {
        const task = res.data.data.item;
        return { task };
      } else {
        handleServerAppError(res.data, dispatch, false);
        return rejectWithValue(res.data);
      }
    });
  });

const updateTask = createAppAsyncThunk<UpdateTaskArg, UpdateTaskArg>(
  "tasks/updateTaskTC",
  async (arg, thunkAPI) => {
    const { dispatch, getState, rejectWithValue } = thunkAPI;
    try {
      const state = getState();
      const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
      if (!task) {
        //throw new Error("task not found in the state");
        console.warn("task not found in the state");
        return rejectWithValue(null);
      }

      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel
      };

      const res = await tasksApi.updateTask(arg.todolistId, arg.taskId, apiModel);
      if (res.data.resultCode === ResultCode.success) {
        return { taskId: arg.taskId, domainModel: arg.domainModel, todolistId: arg.todolistId };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  });

const removeTask = createAppAsyncThunk<RemoveTaskArg, RemoveTaskArg>(
  "tasks/removeTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await tasksApi.deleteTask(arg);
      if (res.data.resultCode === ResultCode.success) {
        return { taskId: arg.taskId, todolistId: arg.todolistId };
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

export const tasksReducer = slice.reducer;
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask };

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
