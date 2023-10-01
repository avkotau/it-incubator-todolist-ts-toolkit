import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import React, { FC, useCallback } from "react";
import { useActions } from "common/hooks/useActions";
import { TodolistDomainType, todosThunks } from "features/TodolistsList/model/todolists/todolists.reducer";

type Props = {
  todolist: TodolistDomainType;
};
export const TodolistTitle: FC<Props> = ({ todolist }) => {

  const { id, title, entityStatus } = todolist;

  const { changeTodolistTitle, removeTodolist } = useActions(todosThunks);
  const removeTodolistHandler = () => {
    removeTodolist(id);
  };

  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      changeTodolistTitle({ id, title });
    }, [id]);

  return (
    <h3>
      <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
      <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  );
};
