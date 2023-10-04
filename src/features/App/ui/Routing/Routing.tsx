import React from "react";
import { Container } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { TodolistsList } from "features/TodolistsList/ui/TodolistsList";
import { Login } from "features/Auth/ui/login/Login";

type Props = {
  demo?: boolean;
};

export const Routing = ({ demo = false }: Props) => {
  return (
    <Container fixed>
      <Routes>
        <Route path={"/"} element={<TodolistsList demo={demo} />} />
        <Route path={"/login"} element={<Login />} />
      </Routes>
    </Container>
  );
};
