import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { baseUrl } from "../../config/url";
import otkLogo from "../../media/OTK.webp";
import backgroundVideo from "../../media/background.mp4";
import "./joinRoom.css";

const qs = require("qs");

export default function JoinRoom() {
  const [isErrorUsernameTakenShown, setIsErrorUsernameTakenShown] = useState(false);
  const [isErrorRoomNotFoundShown, setIsErrorRoomNotFoundShown] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
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
          history.push("/room");
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

  return (
    <div>
      <video className="background" src={backgroundVideo} autoPlay muted loop type="video/mp4" />
      <div className="formWrapper">
        <img className="otkLogo" src={otkLogo} alt="OTK Logo" />
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="inputUsername"
            type="text"
            name="username"
            placeholder="Username"
            {...register("username", { required: true, maxLength: 20 })}
          />
          {errors.username?.type === "required" && (
            <span className="error">Username is required</span>
          )}
          {errors.username?.type === "maxLength" && (
            <span className="error">Maximum length is 20</span>
          )}
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
