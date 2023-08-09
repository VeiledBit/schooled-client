/* eslint-disable react/prop-types */
import React from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import Countdown from "react-countdown";

export default function GameControl({
  btnOpenSiderbar,
  isUserRoomMaster,
  isGameStarted,
  startGame,
  onClickRevealAnswer,
  nextQuestion,
  timerRef,
  onTimerComplete,
  timer,
  questionGrade,
  onChangeQuestionGrade,
  questionCategory,
  onChangeQuestionCategory,
}) {
  return (
    <div className="flex-container-timer">
      <div className="grid-timer">
        <button
          type="button"
          title="Open sidebar"
          className="btn btnDiv1"
          onClick={btnOpenSiderbar}
        >
          <i className="fas fa-bars" />
        </button>
        {isUserRoomMaster ? (
          !isGameStarted ? (
            <button
              type="button"
              title="Start game"
              className="btn btnStartGame btnDiv2"
              onClick={startGame}
            >
              START GAME
            </button>
          ) : (
            <>
              <button
                type="button"
                title="Reveal answer"
                className="btn btnDiv2 btnReveal"
                onClick={onClickRevealAnswer}
              >
                REVEAL
              </button>
              <button
                type="button"
                title="Next question"
                className="btn btnDiv3"
                onClick={nextQuestion}
              >
                NEXT
              </button>
            </>
          )
        ) : (
          <div />
        )}
        <Countdown
          ref={timerRef}
          className="text-center timer btnDiv4"
          title="Change timer"
          autoStart={false}
          onComplete={onTimerComplete}
          date={timer}
        />
        <FormControl className="optionGrade btnDiv5" size="small">
          <Select
            name="grade"
            id="grade"
            title="Change grade"
            value={questionGrade}
            onChange={onChangeQuestionGrade}
          >
            <MenuItem value="Kindergarten">Kindergarten</MenuItem>
            <MenuItem value="1st">1st grade</MenuItem>
            <MenuItem value="2nd">2nd grade</MenuItem>
            <MenuItem value="3rd">3rd grade</MenuItem>
            <MenuItem value="4th">4th grade</MenuItem>
            <MenuItem value="5th">5th grade</MenuItem>
            <MenuItem value="6th">6th grade</MenuItem>
            <MenuItem value="7th">7th grade</MenuItem>
            <MenuItem value="8th">8th grade</MenuItem>
            <MenuItem value="9th">9th grade</MenuItem>
            <MenuItem value="10th">10th grade</MenuItem>
            <MenuItem value="11th">11th grade</MenuItem>
            <MenuItem value="12th">12th grade</MenuItem>
            <MenuItem value="College">College</MenuItem>
          </Select>
        </FormControl>
        <FormControl className="optionCategory btnDiv6" size="small">
          <Select
            name="category"
            id="category"
            title="Change category"
            value={questionCategory}
            onChange={onChangeQuestionCategory}
          >
            <MenuItem value="Math">Math</MenuItem>
            <MenuItem value="Social studies">Social Studies</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
