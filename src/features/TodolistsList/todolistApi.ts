import { instance } from "common/api/api";
import { BaseResponse } from "common/types";
import { ArgsUpdateTodolist, TodolistType } from "features/TodolistsList/todolistApi.types";

export const todolistApi = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<BaseResponse<{ item: TodolistType }>>("todo-lists", { title: title });
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponse>(`todo-lists/${id}`);
  },
  updateTodolist(arg: ArgsUpdateTodolist) {
    return instance.put<BaseResponse>(`todo-lists/${arg.id}`, { title: arg.title });
  },
};


