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
import axios from "axios";
import { toast } from "react-toastify";

// Define the Zod schema for form validation
const signupSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const SignupModal = ({ open, onClose, theme }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const handleSignup = async (data) => {
    if (!recaptchaValue) {
      toast.error("Please complete the reCAPTCHA challenge.", {
        className: "custom-toast-error",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/sign_up", {
        username: data.username,
        password: data.password,
        confirmation_password: data.confirmPassword,
        token: recaptchaValue,
      });

      console.log("Signup successful:", response.data);
      toast.success("Signup successful!", {
        className: "custom-toast-success",
      });

      reset();
      setRecaptchaValue(null);
      onClose();
    } catch (error) {
      // Log the entire error object for debugging
      console.error("Error during signup:", error);

      reset();

      // Check if the error response contains a specific message
      const errorMessage = error.response?.data?.message || error.message;

      toast.error(errorMessage, {
        className: "custom-toast-error",
      });
    }
  };

  const handleCancel = () => {
    reset();
    setRecaptchaValue(null);
    onClose();
  };

  const onRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  return (
    <>
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
        <DialogTitle style={{ color: theme.title }}>Sign Up</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(handleSignup)}>
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
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        margin="dense"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        error={!!errors.confirmPassword}
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
                      {errors.confirmPassword && (
                        <FormHelperText
                          style={{
                            color: "red",
                            marginLeft: 0,
                            marginTop: 4,
                            fontSize: "0.75rem",
                          }}
                        >
                          {errors.confirmPassword.message}
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
                    style={{ width: "100%" }}
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <DialogActions>
                  <Button
                    onClick={handleCancel}
                    style={{ color: theme.textTypeBox }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" style={{ color: theme.textTypeBox }}>
                    Sign Up
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignupModal;
