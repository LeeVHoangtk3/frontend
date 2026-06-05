import './App.css';

import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from './components/LoginRegister';

const App = (props) => {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              {currentUser && <UserList />}
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route path="/login"
                  element={
                    currentUser ? (
                      <Navigate to={`/users/${currentUser._id}`} replace />
                    ) : (
                      <LoginRegister onLogin={(user) => setCurrentUser(user)} />
                    )
                  }
                />
                <Route
                  path="/users/:userId"
                  element={
                    currentUser ? <UserDetail /> : <Navigate to="/login" replace />
                  }
                />
                <Route
                  path="/photos/:userId"
                  element={
                    currentUser ? <UserPhotos /> : <Navigate to="/login" replace />
                  }
                />
                <Route
                  path="/users"
                  element={
                    currentUser ? <UserList /> : <Navigate to="/login" replace />
                  }
                />
                <Route
                  path="*"
                  element={
                    currentUser ? (
                      <Navigate to={`/users/${currentUser._id}`} replace />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
}

export default App;