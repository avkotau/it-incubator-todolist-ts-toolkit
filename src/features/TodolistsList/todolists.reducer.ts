import { appActions, RequestStatusType } from "app/app.reducer";
import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk, handleServerNetworkError } from "common/utils";
import { todolistApi, TodolistType } from "features/TodolistsList/todolistApi";

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state.splice(index, 1);
    },
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      const newTodolist: TodolistDomainType = { ...action.payload.todolist, filter: "all", entityStatus: "idle" };
      state.unshift(newTodolist);
    },
    changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.entityStatus = action.payload.entityStatus;
      }
    },
    // _setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
    //   return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearTasksAndTodolists, () => {
      return [];
    })
      .addCase(fetchTodos.fulfilled, (state, action) =>{
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      })
  }
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;

// thunks
const fetchTodos = createAppAsyncThunk(
  "todo/fetchTodolists",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistApi.getTodolists();
      // dispatch(todolistsActions.setTodolists({ todolists: res.data }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolists: res.data };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);
// export const _fetchTodolistsTC = (): AppThunk => {
//   return (dispatch) => {
//     dispatch(appActions.setAppStatus({ status: "loading" }));
//     todolistApi
//       .getTodolists()
//       .then((res) => {
//         dispatch(todolistsActions.setTodolists({ todolists: res.data }));
//         dispatch(appActions.setAppStatus({ status: "succeeded" }));
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch);
//       });
//   };
// };
export const removeTodolistTC = (id: string): AppThunk => {
  return (dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(appActions.setAppStatus({ status: "loading" }));
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: "loading" }));
    todolistApi.deleteTodolist(id).then((res) => {
      dispatch(todolistsActions.removeTodolist({ id }));
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    });
  };
};
export const addTodolistTC = (title: string): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistApi.createTodolist(title).then((res) => {
      dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    });
  };
};
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
  return (dispatch) => {
    todolistApi.updateTodolist(id, title).then((res) => {
      dispatch(todolistsActions.changeTodolistTitle({ id, title }));
    });
  };
};

export const todosThunks = { fetchTodos };

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
