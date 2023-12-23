import React, { useEffect } from "react";
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { useSelector } from "react-redux";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { authThunks } from "features/Auth/model/auth.reducer";
import { CircularProgress } from "@mui/material";
import { selectIsInitialized } from "features/App/model/app.selectors";
import { useActions } from "common/hooks/useActions";
import { Header } from "features/App/ui/Header/Header";
import { Routing } from "features/App/ui/Routing/Routing";

export function App() {

  const isInitialized = useSelector(selectIsInitialized);

  const { initializeApp } = useActions(authThunks);

  useEffect(() => {
    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <HashRouter>
      <div>
        <ErrorSnackbar />
        <Header />
        <Routing />
      </div>
    </HashRouter>
  );
}
