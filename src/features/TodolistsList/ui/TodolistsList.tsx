import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { FilterValuesType, todolistsActions, todosThunks } from "features/TodolistsList/model/todolists.reducer";
import { tasksThunks } from "features/TodolistsList/model/tasks.reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "features/TodolistsList/ui/Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "features/auth/model/auth.selectors";
import { selectTasks } from "features/TodolistsList/model/tasks.selectors";
import { selectTodolists } from "features/TodolistsList/model/todolists.selectors";
import { TaskStatuses } from "common/enums";
import { useActions } from "common/hooks/useActions";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const {
    fetchTodos,
    addTodolist: addTodolistThunk,
    changeTodolistTitle: changeTodolistTitleThunk,
    removeTodolist: removeTodolistThunk,
    changeTodolistFilter,
    addTask: addTaskThunk, updateTask,
    removeTask: removeTaskThunk
  } = useActions({ ...todosThunks, ...todolistsActions, ...tasksThunks});

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    fetchTodos();
  }, []);

  const removeTask = useCallback(function(taskId: string, todolistId: string) {
    removeTaskThunk({ taskId, todolistId });
  }, []);

  const addTask = useCallback(function(title: string, todolistId: string) {
    addTaskThunk({ title, todolistId });
  }, []);

  const changeStatus = useCallback(function(taskId: string, status: TaskStatuses, todolistId: string) {
    updateTask({ taskId, domainModel: { status }, todolistId });
  }, []);

  const changeTaskTitle = useCallback(function(taskId: string, title: string, todolistId: string) {
    updateTask({ taskId, domainModel: { title }, todolistId });
  }, []);

  const changeFilter = useCallback(function(filter: FilterValuesType, id: string) {
    changeTodolistFilter({ id, filter });
  }, []);

  const removeTodolist = useCallback(function(id: string) {
    removeTodolistThunk(id);
  }, []);

  const changeTodolistTitle = useCallback(function(id: string, title: string) {
    changeTodolistTitleThunk({ id, title });
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      addTodolistThunk(title);
    },
    []
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};