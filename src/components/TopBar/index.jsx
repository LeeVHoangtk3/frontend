import React, { useContext, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { AppContext } from '../../App';

import './styles.css';

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const { title, currentUser, handleLogout } = useContext(AppContext);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('uploadedphoto', file);

    fetch('/photos/new', {
      method: 'POST',
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Photo upload failed.');
        }
        return res.json();
      })
      .then((data) => {
        alert('Photo uploaded successfully!');
        // Refresh the page so the uploaded photo is visible immediately on their photos view
        window.location.reload();
      })
      .catch((err) => {
        alert('Error: ' + err.message);
      });
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          Photo Sharing App
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {currentUser ? (
            <>
              <Typography variant="subtitle1" color="inherit">
                Hi {currentUser.first_name}
              </Typography>
              <Button color="inherit" variant="outlined" onClick={handleUploadClick}>
                Add Photo
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Button color="inherit" variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Typography variant="subtitle1" color="inherit">
              Please Login
            </Typography>
          )}

          {currentUser && (
            <Typography variant="subtitle1" color="inherit" sx={{ ml: 2, pl: 2, borderLeft: '1px solid white' }}>
              {title}
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
