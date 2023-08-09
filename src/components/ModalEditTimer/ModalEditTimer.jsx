/* eslint-disable react/prop-types */
import { Box, Modal } from "@mui/material";
import React from "react";

export default function ModalEditTimer({
  isModalEditTimerOpen,
  modalEditTimerClose,
  btnTimerIncrementMinutes,
  btnTimerDecrementMinutes,
  inputTimerMinutes,
  setInputTimerMinutes,
  btnTimerIncrementSeconds,
  btnTimerDecrementSeconds,
  inputTimerSeconds,
  setInputTimerSeconds
}) {
  return (
    <Modal open={isModalEditTimerOpen} onClose={modalEditTimerClose}>
      <Box className="modalChangeTimerBox">
        <div className="flexboxContainerInputTimer flexboxContainerInputTimerLeft">
          <button
            type="button"
            title="Increase minutes"
            className="btn btnInputTimerIncrement"
            onClick={btnTimerIncrementMinutes}
          >
            <i className="fas fa-chevron-up chevron" />
          </button>
          <input
            className="inputTimer"
            type="number"
            min="0"
            max="60"
            value={inputTimerMinutes}
            onInput={(e) => setInputTimerMinutes(e.target.value)}
          />
          <button
            type="button"
            title="Decrease minutes"
            className="btn btnInputTimerDecrement"
            onClick={btnTimerDecrementMinutes}
          >
            <i className="fas fa-chevron-down chevron" />
          </button>
        </div>
        <div className="flexboxContainerInputTimer flexboxContainerInputTimerRight">
          <button
            type="button"
            title="Increase seconds"
            className="btn btnInputTimerIncrement"
            onClick={btnTimerIncrementSeconds}
          >
            <i className="fas fa-chevron-up chevron" />
          </button>
          <input
            className="inputTimer"
            type="number"
            min="0"
            max="60"
            value={inputTimerSeconds}
            onInput={(e) => setInputTimerSeconds(e.target.value)}
          />
          <button
            type="button"
            title="Decrease seconds"
            className="btn btnInputTimerDecrement"
            onClick={btnTimerDecrementSeconds}
          >
            <i className="fas fa-chevron-down chevron" />
          </button>
        </div>
      </Box>
    </Modal>
  );
}
