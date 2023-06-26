/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import axios from "axios";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useHistory } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { Checkbox, FormControlLabel } from "@mui/material";
import otkLogo from "../../media/OTK.webp";
import backgroundVideo from "../../media/background.mp4";
import { baseUrl } from "../../config/url";
import "./home.css";

export default function Home() {
  const history = useHistory();
  const [captchaToken, setCaptchaToken] = useState("");
  const [isRoomMasterParticipating, setIsRoomMasterParticipating] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = async (formData) => {
    const data = {
      username: formData.username,
      isRoomMasterParticipating,
      captchaToken,
    };
    console.log(baseUrl);
    try {
      await axios.post(`${baseUrl}/createRoom`, data).then((response) => {
        if (response.status === 200) {
          sessionStorage.setItem("roomCode", response.data.roomCode);
          sessionStorage.setItem("username", formData.username);
          history.push("/room");
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
  };

  return (
    <div className="fullSize">
      <video className="background" src={backgroundVideo} autoPlay muted loop type="video/mp4" />
      <div className="formWrapper">
        <img className="otkLogo" src={otkLogo} alt="OTK Logo" />
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="inputUsername"
            type="text"
            name="username"
            placeholder="Username"
            maxLength="20"
            {...register("username", { required: true, maxLength: 20 })}
          />
          <FormControlLabel
            control={
              <Controller
                inputRef={register}
                control={control}
                name="isRoomMasterParticipating"
                render={({ field: props }) => (
                  <Checkbox
                    sx={{
                      color: "#ffffff",
                      "&.Mui-checked": {
                        color: "#ffc31f;",
                      },
                    }}
                    {...props}
                    onChange={() => setIsRoomMasterParticipating(!isRoomMasterParticipating)}
                    checked={isRoomMasterParticipating}
                  />
                )}
              />
            }
            className="checkboxLabel"
            label="Are you participating?"
          />
          {errors.username?.type === "required" && (
            <span className="error">Username is required</span>
          )}
          {errors.username?.type === "maxLength" && (
            <span className="error">Maximum length is 20</span>
          )}
          <div className="captcha">
            <HCaptcha
              sitekey="a0e25f29-e724-4ca8-bb36-826a7c1946ac"
              onVerify={(token) => handleCaptcha(token)}
            />
          </div>
          <button className="btn btnCreate" type="submit">
            CREATE
          </button>
        </form>
      </div>
    </div>
  );
}
