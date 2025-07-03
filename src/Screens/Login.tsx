import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "./common";
import { SSO_SITE } from "../Screens/constants";
import ecopsLogo from "../assets/EcopLogo.png";
import lighthouseImg from "../assets/lighthouse.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
} from "@mui/material";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      // Get the full URL from localStorage if it exists
      const savedUrl = localStorage.getItem("fullRedirectUrl");
      if (savedUrl) {
        localStorage.removeItem("fullRedirectUrl");
        window.location.href = savedUrl;
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api
        .post("users/auth/login/", {
          json: {
            username: credentials.username,
            password: credentials.password,
          },
        })
        .json();

      if (response.error) {
        setError(response.error);
        return;
      }

      // Store auth response
      localStorage.setItem("auth", JSON.stringify(response));

      // Fetch organization info using the correct endpoint
      try {
        const orgResponse = await api.get("esg/user/organization/").json();
        if (!orgResponse.error) {
          localStorage.setItem("organization", JSON.stringify(orgResponse));
        }
      } catch (orgErr) {
        console.error("Failed to fetch organization:", orgErr);
      }

      // Get the redirect path from state or localStorage, fallback to dashboard
      const redirectTo =
        location.state?.from ||
        localStorage.getItem("redirectUrl") ||
        "/dashboard";
      localStorage.removeItem("redirectUrl"); // Clean up
      navigate(redirectTo);
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials");
    }
  };

  const handleSSOLogin = () => {
    // Store the complete current URL
    const currentUrl = window.location.href;
    const fullPath =
      location.state?.from || window.location.pathname + window.location.search;
    localStorage.setItem("fullRedirectUrl", fullPath);
    window.location.href = SSO_SITE;
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Left Side - Logo and Login Form */}
      <Box
        sx={{
          flex: "0 0 50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          position: "relative",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <img
              src={ecopsLogo}
              alt="ECOPS - Sustainability Simplified"
              style={{ height: "50px", marginBottom: "1.5rem" }}
            />
            <Typography variant="h5" fontWeight="500">
              Nice to see you again
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
              Login
            </Typography>
            <TextField
              fullWidth
              placeholder="Email or phone number"
              variant="outlined"
              margin="dense"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f5f5f5",
                  borderRadius: "4px",
                },
              }}
            />

            <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              variant="outlined"
              margin="dense"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f5f5f5",
                  borderRadius: "4px",
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    sx={{
                      color: "#16a085",
                      "&.Mui-checked": {
                        color: "#16a085",
                      },
                    }}
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "#2196f3",
                  textDecoration: "none",
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                textTransform: "none",
                bgcolor: "#16a085",
                "&:hover": {
                  bgcolor: "#138a72",
                },
              }}
            >
              Sign in
            </Button>

            <Box sx={{ position: "relative", my: 3, textAlign: "center" }}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  height: "1px",
                  bgcolor: "#e0e0e0",
                }}
              />
              <Typography
                variant="body2"
                component="span"
                sx={{
                  position: "relative",
                  px: 2,
                  bgcolor: "white",
                  color: "#757575",
                }}
              >
                Or
              </Typography>
            </Box>

            {/* SSO Login Button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleSSOLogin}
              sx={{
                py: 1.5,
                mb: 4,
                color: "#212121",
                borderColor: "#e0e0e0",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#bdbdbd",
                  bgcolor: "#f5f5f5",
                },
              }}
            >
              Sign in with SSO
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{ display: "inline", color: "#757575" }}
              >
                Don't have an account?{" "}
              </Typography>
              <Link
                href="/signup"
                variant="body2"
                sx={{
                  color: "#2196f3",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Sign up now
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flex: "0 0 50%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <img
          src={lighthouseImg}
          alt="Lighthouse"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Box>
    </Box>
  );
};

export default Login;
