import React, { useState } from "react";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { baseUrl } from "../../config/url";
import otkLogo from "../../assets/images/OTK.webp";
import backgroundVideo from "../../assets/videos/background.mp4";
import styles from "./JoinRoom.module.css";

const qs = require("qs");

export default function JoinRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSnackbarErrorShowed, setIsSnackbarErrorShowed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .max(30, "Maximum lenght is 20 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const roomCode = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  }).code;

  const onSubmit = async (formData) => {
    const data = {
      roomCode,
      username: formData.username,
    };

    try {
      await axios.post(`${baseUrl}/joinRoom`, data).then((response) => {
        if (response.status === 200) {
          setIsSnackbarErrorShowed(false);
          sessionStorage.setItem("roomCode", roomCode);
          sessionStorage.setItem("username", formData.username);
          navigate("/room");
        }
      });
    } catch (err) {
      switch (err.response.status) {
        case 404:
          setErrorMessage("Room not found");
          setIsSnackbarErrorShowed(true);
          break;
        case 409:
          setErrorMessage("Username is taken");
          setIsSnackbarErrorShowed(true);
          break;
        default:
          break;
      }
    }
  };

  const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
    },
  });

  return (
    <div>
      <video
        className={styles.background}
        src={backgroundVideo}
        autoPlay
        muted
        loop
        type="video/mp4"
      />
      <div className={styles.formWrapper}>
        <img className={styles.otkLogo} src={otkLogo} alt="OTK Logo" />
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <StyledTextField
            className={styles.inputUsername}
            type="text"
            name="username"
            variant="outlined"
            placeholder="Username"
            autoComplete="off"
            inputProps={{ maxLength: 20 }}
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <Snackbar
            open={isSnackbarErrorShowed}
            autoHideDuration={3000}
            onClose={() => setIsSnackbarErrorShowed(false)}
          >
            <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
              {errorMessage}
            </Alert>
          </Snackbar>
          <button className={`btn ${styles.btnJoin}`} type="submit">
            JOIN
          </button>
        </form>
      </div>
    </div>
  );
}
