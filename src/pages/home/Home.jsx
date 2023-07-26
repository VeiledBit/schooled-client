/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import otkLogo from "../../media/OTK.webp";
import backgroundVideo from "../../media/background.mp4";
import { baseUrl } from "../../config/url";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState("");
  const [isRoomMasterParticipating, setIsRoomMasterParticipating] = useState(false);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .max(30, "Maximum lenght is 20 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

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
          navigate("/room");
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
  };

  const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
    },
  });

  return (
    <div className={styles.fullSize}>
      <video className={styles.background} src={backgroundVideo} autoPlay muted loop type="video/mp4" />
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
            className={styles.checkboxLabel}
            label="Are you participating?"
          />
          <div className={styles.captcha}>
            <HCaptcha
              sitekey="a0e25f29-e724-4ca8-bb36-826a7c1946ac"
              onVerify={(token) => handleCaptcha(token)}
            />
          </div>
          <button className={`btn ${styles.btnCreate}`} type="submit">
            CREATE
          </button>
        </form>
      </div>
    </div>
  );
}
