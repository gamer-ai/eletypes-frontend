import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
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

const LoginModal = ({ open, onClose, theme }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const handleLogin = (data) => {
    if (!recaptchaValue) {
      alert("Please complete the reCAPTCHA challenge.");
      return;
    }

    // Handle login logic here
    console.log("Username:", data.username);
    console.log("Password:", data.password);
    console.log("reCAPTCHA Token:", recaptchaValue);

    // Clear the form fields after login
    reset();
    setRecaptchaValue(null); // Reset reCAPTCHA value

    // Close the modal
    onClose();
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
                          borderColor: theme.textTypeBox,
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
