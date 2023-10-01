import React, { FC, useCallback, useEffect } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolists.reducer";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasks.reducer";
import { TaskType } from "features/TodolistsList/api/tasksApi.types";
import { useActions } from "common/hooks/useActions";
import { FilterTaskButtons } from "features/TodolistsList/ui/Todolist/FilterTaskButtons/FilterTaskButtons";
import { Tasks } from "features/TodolistsList/ui/Todolist/Tasks/Tasks";
import { TodolistTitle } from "features/TodolistsList/ui/Todolist/TodolistTitle/TodolistTitle";

type Props = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
  demo?: boolean;
};

export const Todolist: FC<Props> = React.memo(function(
  {
    todolist,
    tasks,
    demo = false
  }) {

  const { fetchTasks, addTask } = useActions(tasksThunks);

  useEffect(() => {
    if (demo) {
      return;
    }
    fetchTasks(todolist.id);
  }, []);

  const addTaskCallback = useCallback((title: string) => {
      return addTask({ title, todolistId: todolist.id }).unwrap()
    },
    [todolist.id]
  );

  return (
    <div>
      <TodolistTitle todolist={todolist}/>
      <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />
      <Tasks todolist={todolist} tasks={tasks}/>
      <div style={{ paddingTop: "10px" }}>
        <FilterTaskButtons todolist={todolist} />
      </div>
    </div>
  );
});
