import React, { useState } from "react";
import { Typography, TextField, Button, Box, Alert } from "@mui/material";
import axiosClient from "../../api/axiosClient";

function LoginRegister({ onLogin }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [regData, setRegData] = useState({
    login_name: "", password: "", first_name: "", last_name: "",
    location: "", description: "", occupation: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    axiosClient.post("/auth/admin/login", { login_name: loginName, password: loginPassword })
      .then(res => onLogin(res.data))
      .catch(err => {
        const msg = typeof err.response?.data === "string" ? err.response.data : err.response?.data?.message || "dang nhap that bai";
        setLoginError(msg);
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (regData.password !== confirmPassword) {
      setRegError("mat khau xac nhan khong khop.");
      return;
    }
    axiosClient.post("/auth/user", regData)
      .then(() => {
        setLoginName(regData.login_name);
        setRegSuccess("dang ky thanh cong, hay dang nhap.");
        setIsLoginView(true);
        setRegError("");
        setRegData({ login_name: "", password: "", first_name: "", last_name: "", location: "", description: "", occupation: "" });
        setConfirmPassword("");
      })
      .catch(err => {
        const msg = typeof err.response?.data === "string" ? err.response.data : err.response?.data?.message || "dang ky that bai";
        setRegError(msg);
      });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 2 }}>
      {isLoginView ? (
        <form onSubmit={handleLogin}>
          <Typography variant="h5" align="center" gutterBottom>dang nhap</Typography>
          {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}
          {regSuccess && <Alert severity="success" sx={{ mb: 2 }}>{regSuccess}</Alert>}
          <TextField
            fullWidth label="ten dang nhap" margin="normal" required
            value={loginName} onChange={e => { setLoginName(e.target.value); setRegSuccess(""); }}
          />
          <TextField
            fullWidth label="mat khau" type="password" margin="normal" required
            value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>dang nhap</Button>
          <Button fullWidth onClick={() => { setIsLoginView(false); setLoginError(""); setRegSuccess(""); }} sx={{ mt: 1 }}>
            chua co tai khoan, dang ky ngay
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <Typography variant="h5" align="center" gutterBottom>dang ky</Typography>
          <TextField
            fullWidth label="ten dang nhap" margin="dense" required name="login_name"
            value={regData.login_name} onChange={e => setRegData({ ...regData, login_name: e.target.value })}
          />
          <TextField
            fullWidth label="mat khau" type="password" margin="dense" required name="password"
            value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })}
          />
          <TextField
            fullWidth label="xac nhan mat khau" type="password" margin="dense" required
            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
          />
          <TextField
            fullWidth label="ten" margin="dense" required name="first_name"
            value={regData.first_name} onChange={e => setRegData({ ...regData, first_name: e.target.value })}
          />
          <TextField
            fullWidth label="ho" margin="dense" required name="last_name"
            value={regData.last_name} onChange={e => setRegData({ ...regData, last_name: e.target.value })}
          />
          <TextField
            fullWidth label="dia diem" margin="dense" name="location"
            value={regData.location} onChange={e => setRegData({ ...regData, location: e.target.value })}
          />
          <TextField
            fullWidth label="nghe nghiep" margin="dense" name="occupation"
            value={regData.occupation} onChange={e => setRegData({ ...regData, occupation: e.target.value })}
          />
          <TextField
            fullWidth label="mo ta" margin="dense" name="description"
            value={regData.description} onChange={e => setRegData({ ...regData, description: e.target.value })}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>dang ky</Button>
          <Button fullWidth onClick={() => { setIsLoginView(true); setRegError(""); setRegSuccess(""); }} sx={{ mt: 1 }}>
            quay lai dang nhap
          </Button>
          {regError && <Alert severity="error" sx={{ mt: 2 }}>{regError}</Alert>}
        </form>
      )}
    </Box>
  );
}

export default LoginRegister;