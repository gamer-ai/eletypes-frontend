import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the Zod schema for form validation
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const LoginModal = ({ open, setIsAuthenticated, onClose, theme, setUser }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const handleLogin = async (data) => {
    if (!recaptchaValue) {
      toast.error("Please complete the reCAPTCHA challenge.", {
        className: "custom-toast-error",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        {
          username: data.username,
          password: data.password,
          token: recaptchaValue,
        },
        { withCredentials: true },
      );

      if (response.status === 200) {
        setUser((prev) => ({ ...prev, username: data.username }));
        setIsAuthenticated(response.status === 200);
      }

      console.log("Login successful:", response.data);
      toast.success("Login successfully.", {
        className: "custom-toast-success",
      });

      reset();
      setRecaptchaValue(null);
      onClose();
    } catch (error) {
      setIsAuthenticated(false);
      setUser({ username: "" });
      console.error("Error during login:", error);

      reset();

      const errorMessage = error.response?.data?.message || error.message;

      toast.error(errorMessage, {
        className: "custom-toast-error",
      });
    }
  };

  const onRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: theme.background,
          color: theme.text,
          fontFamily: theme.fontFamily,
        },
      }}
      maxWidth="xs" // Set the maximum width of the dialog
      fullWidth // Make the dialog take up full width
    >
      <DialogTitle style={{ color: theme.title }}>Login</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleLogin)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      autoFocus
                      margin="dense"
                      label="Username"
                      type="text"
                      fullWidth
                      variant="outlined"
                      error={!!errors.username}
                      InputLabelProps={{
                        style: { color: theme.textTypeBox },
                      }}
                      InputProps={{
                        style: {
                          color: theme.text,
                          borderColor: theme.textTypeBox,
                        },
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: theme.textTypeBox,
                            },
                            "&:hover fieldset": {
                              borderColor: theme.text,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: theme.textTypeBox,
                              boxShadow: `0 0 5px ${theme.textTypeBox}`,
                            },
                          },
                        },
                      }}
                    />
                    {errors.username && (
                      <FormHelperText
                        style={{
                          color: "red",
                          marginLeft: 0,
                          marginTop: 4,
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.username.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      margin="dense"
                      label="Password"
                      type="password"
                      fullWidth
                      variant="outlined"
                      error={!!errors.password}
                      InputLabelProps={{
                        style: { color: theme.textTypeBox },
                      }}
                      InputProps={{
                        style: {
                          color: theme.text,
                        },
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: theme.textTypeBox,
                            },
                            "&:hover fieldset": {
                              borderColor: theme.text,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: theme.textTypeBox,
                              boxShadow: `0 0 5px ${theme.textTypeBox}`,
                            },
                          },
                        },
                      }}
                    />
                    {errors.password && (
                      <FormHelperText
                        style={{
                          color: "red",
                          marginLeft: 0,
                          marginTop: 4,
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.password.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <ReCAPTCHA
                  theme="dark"
                  sitekey={import.meta.env.VITE_SITE_KEY}
                  style={{ width: "100%" }}
                  onChange={onRecaptchaChange}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <DialogActions>
                <Button onClick={onClose} style={{ color: theme.textTypeBox }}>
                  Cancel
                </Button>
                <Button type="submit" style={{ color: theme.textTypeBox }}>
                  Login
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
