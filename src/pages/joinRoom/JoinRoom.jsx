import React, { useState } from "react";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { baseUrl } from "../../config/url";
import otkLogo from "../../media/OTK.webp";
import backgroundVideo from "../../media/background.mp4";
import "./joinRoom.css";

const qs = require("qs");

export default function JoinRoom() {
  const [isErrorUsernameTakenShown, setIsErrorUsernameTakenShown] = useState(false);
  const [isErrorRoomNotFoundShown, setIsErrorRoomNotFoundShown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
          setIsErrorUsernameTakenShown(false);
          setIsErrorRoomNotFoundShown(false);
          sessionStorage.setItem("roomCode", roomCode);
          sessionStorage.setItem("username", formData.username);
          navigate("/room");
        }
      });
    } catch (err) {
      console.log(err);
      switch (err.response.status) {
        case 404:
          setIsErrorRoomNotFoundShown(true);
          break;
        case 409:
          setIsErrorUsernameTakenShown(true);
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
      <video className="background" src={backgroundVideo} autoPlay muted loop type="video/mp4" />
      <div className="formWrapper">
        <img className="otkLogo" src={otkLogo} alt="OTK Logo" />
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <StyledTextField
            className="inputUsername"
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
          {isErrorRoomNotFoundShown && <span className="error">Room not found</span>}
          {isErrorUsernameTakenShown && <span className="error">Username is taken</span>}
          <button className="btn btnJoin" type="submit">
            JOIN
          </button>
        </form>
      </div>
    </div>
  );
}
