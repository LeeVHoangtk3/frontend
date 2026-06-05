import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import axiosClient from "../../api/axiosClient";
import "./styles.css";

function TopBar({ currentUser, setCurrentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [appContext, setAppContext] = useState("");

  useEffect(() => {
    const [, viewType, userId] = location.pathname.split("/");
    if (userId && (viewType === "users" || viewType === "photos")) {
      fetchModel(`/user/${userId}`)
        .then(res => {
          const user = res.data;
          setAppContext(viewType === "users" ? `${user.first_name} ${user.last_name}` : `Photos of ${user.first_name} ${user.last_name}`);
        })
        .catch(err => console.error("Lỗi khi lấy thông tin user cho TopBar:", err));
    } else {
      setAppContext("");
    }
  }, [location.pathname]);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await axiosClient.post("/photo/new", formData);
      alert("Upload photo successfully!");
      navigate(`/photos/${currentUser._id}`);
      if (location.pathname === `/photos/${currentUser._id}`) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Lỗi khi upload ảnh:", err);
      alert(err.response?.data?.message || "Failed to upload photo");
    }
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/admin/logout");
      setCurrentUser(null);
    } catch (err) {
      console.log("Lỗi khi đăng xuất:", err);
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6" color="inherit" sx={{ fontWeight: "bold" }}>
            {currentUser ? `Hi ${currentUser.first_name}` : "Please login"}
          </Typography>
          <Typography variant="body2" color="inherit">
            This is the TopBar component
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5" color="inherit" sx={{ mr: 4 }}>
            {appContext}
          </Typography>

          {currentUser && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="topbar-upload-file-button"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="topbar-upload-file-button">
                <Button variant="contained" sx={{ bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "#f5f5f5" } }} component="span">
                  Add Photo
                </Button>
              </label>
              <Button variant="contained" sx={{ bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "#f5f5f5" } }} onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;