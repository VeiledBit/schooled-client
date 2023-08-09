/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import styles from "./GradeButtons.module.css";
import ws from "../../socket/ws";

export default function GradeButtons({ user, setUsersArray }) {
  const roomCode = sessionStorage.getItem("roomCode");
  const incrementFails = (e) => {
    const userId = e.target.value;
    ws.emit("increment-fails", roomCode, userId);
  };

  const decrementFails = (e) => {
    const userId = e.target.value;
    ws.emit("decrement-fails", roomCode, userId);
  };

  useEffect(() => {
    ws.on("confirm-increment", (data) => {
      setUsersArray(data.users);
    });

    ws.on("confirm-decrement", (data) => {
      setUsersArray(data.users);
    });
  }, []);
  return (
    <>
      <button
        type="button"
        title="Increase F grade count"
        className={`btn ${styles.btnFPlus} div3`}
        value={user.userId}
        onClick={incrementFails}
      >
        +F
      </button>
      <button
        type="button"
        title="Decrease F grade count"
        className="btn div4"
        value={user.userId}
        onClick={decrementFails}
      >
        -F
      </button>
    </>
  );
}
