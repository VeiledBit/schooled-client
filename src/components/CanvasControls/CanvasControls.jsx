/* eslint-disable react/prop-types */
import React from "react";
import { Slider } from "@mui/material";

export default function CanvasControls({
  setDrawingMode,
  onUndo,
  setIsColorPickerShown,
  isColorPickerShown,
  save,
  clearCanvas,
  isPencilThicknessSliderShown,
  pencilThickness,
  setPencilThickness,
  eraserThickness,
  onChangeEraserThickness,
  isUserRoomMaster,
  isRoomMasterParticipating,
  isBtnLockInDisabled,
  onClickLockIn,
}) {
  return (
    <>
      <button
        type="button"
        title="Pen"
        className="btn cdiv2 alignJustify"
        onClick={() => setDrawingMode(true)}
      >
        <i className="fas fa-pen" />
      </button>
      <button
        type="button"
        title="Eraser"
        className="btn btnEraser cdiv3 alignJustify"
        onClick={() => setDrawingMode(false)}
      >
        <i className="fas fa-eraser" />
      </button>
      <button
        type="button"
        title="Undo"
        className="btn btnUndo cdiv4 alignJustify"
        onClick={onUndo}
      >
        <i className="fas fa-undo" />
      </button>
      <button
        type="button"
        title="Palette"
        className="btn btnColorPicker cdiv5 alignJustify"
        onClick={() => setIsColorPickerShown(!isColorPickerShown)}
      >
        <i className="fas fa-palette" />
      </button>
      <button
        type="button"
        title="Save image locally"
        className="btn cdivSave alignJustify"
        onClick={save}
      >
        <i className="fa-solid fa-floppy-disk" />
      </button>
      <button
        type="button"
        title="Clear board"
        className="btn btnClearCanvas cdiv6 alignJustify"
        onClick={clearCanvas}
      >
        CLEAR
      </button>
      {isPencilThicknessSliderShown ? (
        <Slider
          aria-label="Pencil thickness"
          title="Pencil thickness"
          className="pencilThickness cdiv7 alignJustify"
          valueLabelDisplay="auto"
          min={1}
          max={10}
          value={pencilThickness}
          onChange={(e) => setPencilThickness(e.target.value)}
        />
      ) : (
        <Slider
          aria-label="Eraser thickness"
          title="Eraser thickness"
          className="pencilThickness cdiv7 alignJustify"
          valueLabelDisplay="auto"
          min={2}
          max={20}
          step={2}
          value={eraserThickness}
          onChange={(e) => onChangeEraserThickness(e.target.value)}
        />
      )}
      {isUserRoomMaster ? (
        isRoomMasterParticipating ? (
          <button
            type="button"
            title="Lock in answer"
            className="btn cdiv8 alignJustify"
            disabled={isBtnLockInDisabled}
            onClick={onClickLockIn}
          >
            LOCK
          </button>
        ) : (
          <div />
        )
      ) : (
        <button
          type="button"
          title="Lock in answer"
          className="btn cdiv8 alignJustify"
          disabled={isBtnLockInDisabled}
          onClick={onClickLockIn}
        >
          LOCK
        </button>
      )}
    </>
  );
}
