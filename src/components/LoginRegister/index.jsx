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
        const msg = typeof err.response?.data === "string" ? err.response.data : err.response?.data?.message || "Đăng nhập thất bại";
        setLoginError(msg);
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (regData.password !== confirmPassword) {
      setRegError("Mật khẩu xác nhận không khớp!");
      return;
    }
    axiosClient.post("/auth/user", regData)
      .then(() => {
        setLoginName(regData.login_name);
        setRegSuccess("Đăng ký thành công! Hãy đăng nhập.");
        setIsLoginView(true);
        setRegError("");
        setRegData({ login_name: "", password: "", first_name: "", last_name: "", location: "", description: "", occupation: "" });
        setConfirmPassword("");
      })
      .catch(err => {
        const msg = typeof err.response?.data === "string" ? err.response.data : err.response?.data?.message || "Đăng ký thất bại";
        setRegError(msg);
      });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 2 }}>
      {isLoginView ? (
        <form onSubmit={handleLogin}>
          <Typography variant="h5" align="center" gutterBottom>Đăng nhập</Typography>
          {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}
          {regSuccess && <Alert severity="success" sx={{ mb: 2 }}>{regSuccess}</Alert>}
          <TextField
            fullWidth label="Tên đăng nhập" margin="normal" required
            value={loginName} onChange={e => { setLoginName(e.target.value); setRegSuccess(""); }}
          />
          <TextField
            fullWidth label="Mật khẩu" type="password" margin="normal" required
            value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Đăng nhập</Button>
          <Button fullWidth onClick={() => { setIsLoginView(false); setLoginError(""); setRegSuccess(""); }} sx={{ mt: 1 }}>
            Chưa có tài khoản? Đăng ký ngay
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <Typography variant="h5" align="center" gutterBottom>Đăng ký</Typography>
          <TextField
            fullWidth label="Tên đăng nhập" margin="dense" required name="login_name"
            value={regData.login_name} onChange={e => setRegData({ ...regData, login_name: e.target.value })}
          />
          <TextField
            fullWidth label="Mật khẩu" type="password" margin="dense" required name="password"
            value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })}
          />
          <TextField
            fullWidth label="Xác nhận mật khẩu" type="password" margin="dense" required
            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
          />
          <TextField
            fullWidth label="Tên" margin="dense" required name="first_name"
            value={regData.first_name} onChange={e => setRegData({ ...regData, first_name: e.target.value })}
          />
          <TextField
            fullWidth label="Họ" margin="dense" required name="last_name"
            value={regData.last_name} onChange={e => setRegData({ ...regData, last_name: e.target.value })}
          />
          <TextField
            fullWidth label="Địa điểm" margin="dense" name="location"
            value={regData.location} onChange={e => setRegData({ ...regData, location: e.target.value })}
          />
          <TextField
            fullWidth label="Nghề nghiệp" margin="dense" name="occupation"
            value={regData.occupation} onChange={e => setRegData({ ...regData, occupation: e.target.value })}
          />
          <TextField
            fullWidth label="Mô tả" margin="dense" name="description"
            value={regData.description} onChange={e => setRegData({ ...regData, description: e.target.value })}
          />
          <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2 }}>Đăng ký</Button>
          <Button fullWidth onClick={() => { setIsLoginView(true); setRegError(""); setRegSuccess(""); }} sx={{ mt: 1 }}>
            Quay lại Đăng nhập
          </Button>
          {regError && <Alert severity="error" sx={{ mt: 2 }}>{regError}</Alert>}
        </form>
      )}
    </Box>
  );
}

export default LoginRegister;