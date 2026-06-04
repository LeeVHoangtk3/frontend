import './App.css';

import React, { useState } from 'react';
import { Grid, Paper } from '@mui/material';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import TopBar from './components/TopBar';
import UserDetail from './components/UserDetail';
import UserList from './components/UserList';
import UserPhotos from './components/UserPhotos';
import LoginRegister from './components/LoginRegister';

export const AppContext = React.createContext({
  title: 'Photo Sharing App',
  setTitle: () => { },
  currentUser: null,
  setCurrentUser: () => { },
  handleLogout: () => { },
});

const App = () => {
  const [title, setTitle] = useState('Photo Sharing App');
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    fetch('/admin/logout', { method: 'POST' })
      .then(() => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
      })
      .catch((err) => {
        console.error('Logout failed:', err);
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
      });
  };

  return (
    <AppContext.Provider value={{ title, setTitle, currentUser, setCurrentUser: handleLoginSuccess, handleLogout }}>
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                {currentUser ? <UserList /> : <div style={{ padding: 16 }}>Please log in to view users.</div>}
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  {currentUser ? (
                    <>
                      <Route path="/users/:userId" element={<UserDetail />} />
                      <Route path="/photos/:userId" element={<UserPhotos />} />
                      <Route path="/users" element={<UserList />} />
                      <Route path="/" element={<Navigate replace to={`/users/${currentUser._id}`} />} />
                      <Route path="*" element={<Navigate replace to={`/users/${currentUser._id}`} />} />
                    </>
                  ) : (
                    <>
                      <Route path="/login-register" element={<LoginRegister onLoginSuccess={handleLoginSuccess} />} />
                      <Route path="*" element={<Navigate replace to="/login-register" />} />
                    </>
                  )}
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
