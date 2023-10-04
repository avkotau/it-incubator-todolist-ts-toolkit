import React, { useCallback } from "react";
import { AppBar, Button, IconButton, LinearProgress, Toolbar, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectAppStatus } from "features/App/model/app.selectors";
import { selectIsLoggedIn } from "features/Auth/model/auth.selectors";
import { useActions } from "common/hooks/useActions";
import { authThunks } from "features/Auth/model/auth.reducer";

export const Header = () => {
  const status = useSelector(selectAppStatus);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const { logout } = useActions(authThunks);


  const logoutHandler = useCallback(() => {
    logout();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography variant="h6"></Typography>
        {isLoggedIn && (
          <Button color="inherit" onClick={logoutHandler}>
            Log out
          </Button>
        )}
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  );
};
