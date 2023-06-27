/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable func-names */
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { SketchPicker } from "react-color";
import Countdown from "react-countdown";
import Snackbar from "@mui/material/Snackbar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FormControl, MenuItem, Select, Slider } from "@mui/material";
import ws from "../../socket/ws.js";
import blackBoardImage from "../../media/blackboard.jpg";
import GradeButtons from "../../components/GradeButtons/GradeButtons.jsx";
import GradeImages from "../../components/GradeImages/GradeImages.jsx";
import { baseUrl, inviteUrl } from "../../config/url";
import "./room.css";

export default function Room() {
  const history = useHistory();
  const [question, setQuestion] = useState("Question");
  const [answer, setAnswer] = useState("Answer");
  const [img1, setImg1] = useState(blackBoardImage);
  const [img2, setImg2] = useState(blackBoardImage);
  const [img3, setImg3] = useState(blackBoardImage);
  const [img4, setImg4] = useState(blackBoardImage);
  const [img5, setImg5] = useState(blackBoardImage);
  const [img6, setImg6] = useState(blackBoardImage);
  const [img7, setImg7] = useState(blackBoardImage);
  const [img8, setImg8] = useState(blackBoardImage);
  const [canvasLargeAnswer, setCanvasLargeAnswer] = useState();
  const refImg1 = useRef(null);
  const refImg2 = useRef(null);
  const refImg3 = useRef(null);
  const refImg4 = useRef(null);
  const refImg5 = useRef(null);
  const refImg6 = useRef(null);
  const refImg7 = useRef(null);
  const refImg8 = useRef(null);
  const [username1, setUsername1] = useState("Player 1");
  const [username2, setUsername2] = useState("Player 2");
  const [username3, setUsername3] = useState("Player 3");
  const [username4, setUsername4] = useState("Player 4");
  const [username5, setUsername5] = useState("Player 5");
  const [username6, setUsername6] = useState("Player 6");
  const [username7, setUsername7] = useState("Player 7");
  const [username8, setUsername8] = useState("Player 8");
  const [user1_grade1, setUser1_grade1] = useState("none");
  const [user1_grade2, setUser1_grade2] = useState("none");
  const [user1_grade3, setUser1_grade3] = useState("none");
  const [user2_grade1, setUser2_grade1] = useState("none");
  const [user2_grade2, setUser2_grade2] = useState("none");
  const [user2_grade3, setUser2_grade3] = useState("none");
  const [user3_grade1, setUser3_grade1] = useState("none");
  const [user3_grade2, setUser3_grade2] = useState("none");
  const [user3_grade3, setUser3_grade3] = useState("none");
  const [user4_grade1, setUser4_grade1] = useState("none");
  const [user4_grade2, setUser4_grade2] = useState("none");
  const [user4_grade3, setUser4_grade3] = useState("none");
  const [user5_grade1, setUser5_grade1] = useState("none");
  const [user5_grade2, setUser5_grade2] = useState("none");
  const [user5_grade3, setUser5_grade3] = useState("none");
  const [user6_grade1, setUser6_grade1] = useState("none");
  const [user6_grade2, setUser6_grade2] = useState("none");
  const [user6_grade3, setUser6_grade3] = useState("none");
  const [user7_grade1, setUser7_grade1] = useState("none");
  const [user7_grade2, setUser7_grade2] = useState("none");
  const [user7_grade3, setUser7_grade3] = useState("none");
  const [user8_grade1, setUser8_grade1] = useState("none");
  const [user8_grade2, setUser8_grade2] = useState("none");
  const [user8_grade3, setUser8_grade3] = useState("none");
  const [isUserRoomMaster, setIsUserRoomMaster] = useState(false);
  const [isRoomMasterParticipating, setIsRoomMasterParticipating] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isQuestionShown, setIsQuestionShown] = useState(true);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [isColorPickerShown, setIsColorPickerShown] = useState(false);
  const [pencilColor, setPencilColor] = useState("#000000");
  const [pencilThickness, setPencilThickness] = useState(2);
  const [eraserThickness, setEraserThickness] = useState(4);
  const [isPencilThicknessSliderShown, setIsPencilThicknessSliderShown] = useState(true);
  const roomCode = sessionStorage.getItem("roomCode");
  const username = sessionStorage.getItem("username");
  const canvasRef = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState();
  const [canvasHeight, setCanvasHeight] = useState();
  let offsetX;
  let offsetY;
  const [canvasStates, setCanvasStates] = useState();
  const gridCanvasRef = useRef(null);
  const canvasCacheRef = useRef(null); // Second hidden canvas for anti-aliasing
  const timerRef = useRef(null);
  const sidebar = useRef(null);
  const sidebarOpenBackground = useRef(null);
  const canvasAnswerLargeBackground = useRef(null);
  const [inputTimerSeconds, setInputTimerSeconds] = useState(30);
  const [inputTimerMinutes, setInputTimerMinutes] = useState(0);
  const [timer, setTimer] = useState(
    Date.now() + (inputTimerMinutes * 60 * 1000 + inputTimerSeconds * 1000)
  );
  const [questionGrade, setQuestionGrade] = useState("Kindergarten");
  const [questionCategory, setQuestionCategory] = useState("Math");
  const [isAnswerLockedIn, setIsAnswerLockedIn] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isModalEditTimerOpen, setIsModalTimerOpen] = useState(false);
  const [isBtnLockInDisabled, setIsBtnLockInDisabled] = useState(true);
  const [isBtnCanvasAnswerLarge1Disabled, setIsBtnCanvasAnswerLarge1Disabled] = useState(true);
  const [isBtnCanvasAnswerLarge2Disabled, setIsBtnCanvasAnswerLarge2Disabled] = useState(true);
  const [isBtnCanvasAnswerLarge3Disabled, setIsBtnCanvasAnswerLarge3Disabled] = useState(true);
  const [isBtnCanvasAnswerLarge4Disabled, setIsBtnCanvasAnswerLarge4Disabled] = useState(true);
  const [isBtnCanvasAnswerLarge5Disabled, setIsBtnCanvasAnswerLarge5Disabled] = useState(true);
  const [isBtnCanvasAnswerLarge6Disabled, setIsBtnCanvasAnswerLarge6Disabled] = useState(true);
  const [isBtnCanvasAnswerLarge7Disabled, setIsBtnCanvasAnswerLarge7Disabled] = useState(true);
  const [isBtnCanvasAnswerLarge8Disabled, setIsBtnCanvasAnswerLarge8Disabled] = useState(true);
  const [isBtnF1Disabled, setIsBtnF1Disabled] = useState(true);
  const [isBtnF2Disabled, setIsBtnF2Disabled] = useState(true);
  const [isBtnF3Disabled, setIsBtnF3Disabled] = useState(true);
  const [isBtnF4Disabled, setIsBtnF4Disabled] = useState(true);
  const [isBtnF5Disabled, setIsBtnF5Disabled] = useState(true);
  const [isBtnF6Disabled, setIsBtnF6Disabled] = useState(true);
  const [isBtnF7Disabled, setIsBtnF7Disabled] = useState(true);
  const [isBtnF8Disabled, setIsBtnF8Disabled] = useState(true);
  const [isCanvasAnswerLargeShown, setIsCanvasAnswerLargeShown] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);

  function midPointBetween(p1, p2) {
    return {
      x: p1.x + (p2.x - p1.x) / 2,
      y: p1.y + (p2.y - p1.y) / 2,
    };
  }

  useEffect(() => {
    setCanvasWidth(canvasRef.current.clientWidth - 2);
    setCanvasHeight(canvasRef.current.clientHeight - 2);
    setCanvasStates([
      new ImageData(canvasRef.current.clientWidth - 2, canvasRef.current.clientHeight - 2),
    ]);
  }, []);

  useEffect(() => {
    setTimer(Date.now() + (inputTimerMinutes * 60 * 1000 + inputTimerSeconds * 1000));
  }, [inputTimerMinutes, inputTimerSeconds]);

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      e.returnValue = "";
    });
  });

  useEffect(() => {
    async function fetchUsersInfo() {
      try {
        await axios.get(`${baseUrl}/usersInfo?roomCode=${roomCode}`).then((response) => {
          const users = response.data;
          users.forEach((user) => {
            if (user.userId === 0) {
              setIsRoomMasterParticipating(false);
              return;
            }
            eval(`setUsername${user.userId}("${user.username}")`);
            eval(`setIsBtnF${user.userId}Disabled(null)`);
            for (let i = 0; i < user.failCount; i += 1) {
              const stringForEval = `setUser${user.userId}_grade${i + 1}("block")`;
              eval(stringForEval);
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    }

    fetchUsersInfo();
  }, [roomCode]);

  useEffect(() => {
    const data = {
      roomCode,
      username,
    };
    ws.emit("join-room", data, (isRoomMaster) => {
      if (isRoomMaster) {
        setIsUserRoomMaster(true);
      }
    });
  }, []);

  useEffect(() => {
    function handleResize() {
      setCanvasWidth(canvasRef.current.clientWidth - 2);
      setCanvasHeight(canvasRef.current.clientHeight - 2);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const boundingRect = canvasRef.current.getBoundingClientRect();
      offsetX = boundingRect.left;
      offsetY = boundingRect.top;
    });
  });

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const ctxCache = canvasCacheRef.current.getContext("2d");
    const boundingRect = canvasRef.current.getBoundingClientRect();
    offsetX = boundingRect.left;
    offsetY = boundingRect.top;
    let isDrawing;
    const points = [];
    if (isPencilThicknessSliderShown) {
      ctx.lineWidth = pencilThickness;
    } else {
      ctx.lineWidth = eraserThickness;
    }
    // eslint-disable-next-line no-multi-assign
    ctx.lineJoin = ctx.lineCap = "round";

    canvasRef.current.onmousedown = function (e) {
      if (isAnswerLockedIn === true) return;
      isDrawing = true;
      points.push({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    };

    canvasRef.current.onmousemove = function (e) {
      if (!isDrawing) return;
      ctx.beginPath();
      if (eraserMode) {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.strokeStyle = pencilColor;
        ctx.globalCompositeOperation = "source-over";
      }

      points.push({ x: e.clientX - offsetX, y: e.clientY - offsetY });
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.putImageData(ctxCache.getImageData(0, 0, canvasWidth, canvasHeight), 0, 0);
      let p1 = points[0];
      let p2 = points[1];

      ctx.moveTo(p1.x, p1.y);
      for (let i = 1, len = points.length; i < len; i += 1) {
        const midPoint = midPointBetween(p1, p2);
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = points[i];
        p2 = points[i + 1];
      }

      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
    };

    canvasRef.current.onmouseup = function () {
      ctx.closePath();
      isDrawing = false;
      ctxCache.putImageData(ctx.getImageData(0, 0, canvasWidth, canvasHeight), 0, 0);
      points.length = 0;
      setCanvasStates((oldStates) => [
        ...oldStates,
        ctx.getImageData(0, 0, canvasWidth, canvasHeight),
      ]);
    };

    canvasRef.current.onmouseleave = function () {
      ctx.closePath();
      isDrawing = false;
    };
  });

  const updateTimer = (minutes, seconds) => {
    ws.emit("update-timer", roomCode, minutes, seconds);
  };

  const modalEditTimerOpen = () => {
    if (!isTimerStarted) {
      setIsModalTimerOpen(true);
    }
  };

  const modalEditTimerClose = () => {
    setIsModalTimerOpen(false);
    updateTimer(inputTimerMinutes, inputTimerSeconds);
  };

  useEffect(() => {
    const elements = Array.from(document.getElementsByClassName("timer"));
    if (isUserRoomMaster) {
      elements[0].onclick = modalEditTimerOpen;
      elements[0].style.cursor = "pointer";
      elements[0].title = "Change timer";
    }
  });

  useEffect(() => {
    ws.on("question", (questionResponse, answerResponse) => {
      setQuestion(questionResponse);
      setAnswer(answerResponse);
      setIsQuestionShown(true);
      timerRef.current.stop();
      timerRef.current.start();
      setIsTimerStarted(true);
      setIsBtnLockInDisabled(false);
      setIsBtnCanvasAnswerLarge1Disabled(true);
      setIsBtnCanvasAnswerLarge2Disabled(true);
      setIsBtnCanvasAnswerLarge3Disabled(true);
      setIsBtnCanvasAnswerLarge4Disabled(true);
      setIsBtnCanvasAnswerLarge5Disabled(true);
      setIsBtnCanvasAnswerLarge6Disabled(true);
      setIsBtnCanvasAnswerLarge7Disabled(true);
      setIsBtnCanvasAnswerLarge8Disabled(true);
      setIsAnswerLockedIn(false);
      if (refImg1.current !== null) refImg1.current.style.border = "4px solid #c2c3cb";
      if (refImg2.current !== null) refImg2.current.style.border = "4px solid #c2c3cb";
      if (refImg3.current !== null) refImg3.current.style.border = "4px solid #c2c3cb";
      if (refImg4.current !== null) refImg4.current.style.border = "4px solid #c2c3cb";
      if (refImg5.current !== null) refImg5.current.style.border = "4px solid #c2c3cb";
      if (refImg6.current !== null) refImg6.current.style.border = "4px solid #c2c3cb";
      if (refImg7.current !== null) refImg7.current.style.border = "4px solid #c2c3cb";
      if (refImg8.current !== null) refImg8.current.style.border = "4px solid #c2c3cb";
    });

    ws.on("request-canvas-data", () => {
      const theDataURL = canvasRef.current.toDataURL();
      ws.emit("canvas-data", roomCode, username, theDataURL);
    });

    ws.on("update-timer-response", (newTimerMinutes, newTimerSeconds) => {
      setInputTimerMinutes(newTimerMinutes);
      setInputTimerSeconds(newTimerSeconds);
    });

    ws.on("canvas-receive", (data) => {
      switch (data.id) {
        case 1:
          setImg1(data.canvasData);
          setIsBtnCanvasAnswerLarge1Disabled(null);
          break;
        case 2:
          setImg2(data.canvasData);
          setIsBtnCanvasAnswerLarge2Disabled(null);
          break;
        case 3:
          setImg3(data.canvasData);
          setIsBtnCanvasAnswerLarge3Disabled(null);
          break;
        case 4:
          setImg4(data.canvasData);
          setIsBtnCanvasAnswerLarge4Disabled(null);
          break;
        case 5:
          setImg5(data.canvasData);
          setIsBtnCanvasAnswerLarge5Disabled(null);
          break;
        case 6:
          setImg6(data.canvasData);
          setIsBtnCanvasAnswerLarge6Disabled(null);
          break;
        case 7:
          setImg7(data.canvasData);
          setIsBtnCanvasAnswerLarge7Disabled(null);
          break;
        case 8:
          setImg8(data.canvasData);
          setIsBtnCanvasAnswerLarge8Disabled(null);
          break;
        default:
          console.log(data.id);
          console.log("I don't know wtf happened...");
          break;
      }
      setIsQuestionShown(false); // TODO move this to a better place
      setIsAnswerLockedIn(false);

      if (refImg1.current !== null) refImg1.current.style.border = "4px solid #c2c3cb";
      if (refImg2.current !== null) refImg2.current.style.border = "4px solid #c2c3cb";
      if (refImg3.current !== null) refImg3.current.style.border = "4px solid #c2c3cb";
      if (refImg4.current !== null) refImg4.current.style.border = "4px solid #c2c3cb";
      if (refImg5.current !== null) refImg5.current.style.border = "4px solid #c2c3cb";
      if (refImg6.current !== null) refImg6.current.style.border = "4px solid #c2c3cb";
      if (refImg7.current !== null) refImg7.current.style.border = "4px solid #c2c3cb";
      if (refImg8.current !== null) refImg8.current.style.border = "4px solid #c2c3cb";

      timerRef.current.stop();
      setIsTimerStarted(false);
      setIsBtnLockInDisabled(true);
    });

    ws.on("confirm-increment", (data) => {
      if (typeof data.currentCount !== "undefined") {
        const funcName = `setUser${data.userId}_grade${data.currentCount}("block")`;
        eval(funcName);
      }
    });

    ws.on("confirm-decrement", (data) => {
      if (typeof data.currentCount !== "undefined") {
        const funcName = `setUser${data.userId}_grade${data.currentCount + 1}("none")`;
        eval(funcName);
      }
    });

    ws.on("answer-locked-in-response", (data) => {
      switch (data.userOrder) {
        case 0:
          break;
        case 1:
          refImg1.current.style.border = "0.25em solid #ffc31f";
          break;
        case 2:
          refImg2.current.style.border = "0.25em solid #ffc31f";
          break;
        case 3:
          refImg3.current.style.border = "0.25em solid #ffc31f";
          break;
        case 4:
          refImg4.current.style.border = "0.25em solid #ffc31f";
          break;
        case 5:
          refImg5.current.style.border = "0.25em solid #ffc31f";
          break;
        case 6:
          refImg6.current.style.border = "0.25em solid #ffc31f";
          break;
        case 7:
          refImg7.current.style.border = "0.25em solid #ffc31f";
          break;
        case 8:
          refImg8.current.style.border = "0.25em solid #ffc31f";
          break;
        default:
          console.log(data.userOrder);
          console.log("I don't know wtf happened...");
          break;
      }
    });

    ws.on("user-join", (data) => {
      switch (data.userOrder) {
        case 0:
          break;
        case 1:
          setUsername1(data.username);
          setIsBtnF1Disabled(null);
          break;
        case 2:
          setUsername2(data.username);
          setIsBtnF2Disabled(null);
          break;
        case 3:
          setUsername3(data.username);
          setIsBtnF3Disabled(null);
          break;
        case 4:
          setUsername4(data.username);
          setIsBtnF4Disabled(null);
          break;
        case 5:
          setUsername5(data.username);
          setIsBtnF5Disabled(null);
          break;
        case 6:
          setUsername6(data.username);
          setIsBtnF6Disabled(null);
          break;
        case 7:
          setUsername7(data.username);
          setIsBtnF7Disabled(null);
          break;
        case 8:
          setUsername8(data.username);
          setIsBtnF8Disabled(null);
          break;
        default:
          console.log(data.userOrder);
          console.log(data.username);
          console.log("I don't know wtf happened...");
          break;
      }
    });
  }, [roomCode, username]);

  const startGame = () => {
    setIsGameStarted(true);
    ws.emit("get-question", roomCode, questionGrade, questionCategory);
  };

  const commenceReveal = () => {
    ws.emit("commence-reveal", roomCode);
  };

  const onClickRevealAnswer = () => {
    commenceReveal();
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    const ctxCache = canvasCacheRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctxCache.clearRect(0, 0, canvasWidth, canvasHeight);
    canvasRef.current.width = canvasWidth; // prevents image from reappering on canvas
    ctx.lineWidth = pencilThickness;
    ctx.lineCap = "round";
    ctx.lineJoin = ctx.lineCap;
    setCanvasStates((oldStates) => [
      ...oldStates,
      ctx.getImageData(0, 0, canvasWidth, canvasHeight),
    ]);
  };

  const incrementFails = (e) => {
    const userId = e.target.value;
    ws.emit("increment-fails", roomCode, userId);
  };

  const decrementFails = (e) => {
    const userId = e.target.value;
    ws.emit("decrement-fails", roomCode, userId);
  };

  const nextQuestion = () => {
    setImg1(blackBoardImage);
    setImg2(blackBoardImage);
    setImg3(blackBoardImage);
    setImg4(blackBoardImage);
    setImg5(blackBoardImage);
    setImg6(blackBoardImage);
    setImg7(blackBoardImage);
    setImg8(blackBoardImage);
    ws.emit("get-question", roomCode, questionGrade, questionCategory);
  };

  const onTimerComplete = () => {
    setIsTimerStarted(false);
    setIsBtnLockInDisabled(true);
  };

  const onColorChange = (color) => {
    setPencilColor(color.hex);
  };

  const onUndo = () => {
    const ctx = canvasRef.current.getContext("2d");
    const ctxCache = canvasCacheRef.current.getContext("2d");
    let imageData;
    if (canvasStates.length === 0) {
      return;
    }
    if (canvasStates.length === 1) {
      [imageData] = canvasStates;
      ctx.putImageData(imageData, 0, 0);
      ctxCache.putImageData(imageData, 0, 0);
    } else {
      canvasStates.pop();
      setCanvasStates(canvasStates);
      imageData = canvasStates[canvasStates.length - 1];
      ctx.putImageData(imageData, 0, 0);
      ctxCache.putImageData(imageData, 0, 0);
    }
  };

  let picker;
  if (isColorPickerShown) {
    picker = (
      <SketchPicker
        display={false}
        disableAlpha
        color={pencilColor}
        onChange={onColorChange}
        onChangeComplete={onColorChange}
      />
    );
  } else {
    picker = <div />;
  }

  const snackbarOpen = () => {
    setIsSnackbarOpen(true);
  };

  const snackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const inviteLink = `${inviteUrl}/joinRoom?code=${roomCode}`;
  const onClickCopyInvite = () => {
    navigator.clipboard.writeText(inviteLink).then(
      () => {
        snackbarOpen();
      },
      (err) => {
        console.error("Link not copied", err);
      }
    );
  };

  const onClickLeaveRoom = () => {
    ws.emit("leave-room", roomCode, username);
    sessionStorage.removeItem("roomCode");
    sessionStorage.removeItem("username");
    history.replace("/");
  };

  const onClickLockIn = () => {
    setIsAnswerLockedIn(true);
    setIsBtnLockInDisabled(true);
    ws.emit("answer-locked-in", roomCode, username);
  };

  const changeEraserCursor = (value = eraserThickness) => {
    const cursorOffset = value / 2;
    const cursor = `(./cursor${value}.svg) ${cursorOffset} ${cursorOffset}, auto`;
    const cursorUrl = `url${cursor}`;
    canvasRef.current.style.cursor = cursorUrl;
  };

  const onChangeEraserThickness = (value) => {
    setEraserThickness(value);
    changeEraserCursor(value);
  };

  const setDrawingMode = (mode) => {
    if (mode) {
      setEraserMode(false);
      setIsPencilThicknessSliderShown(true);
      canvasRef.current.style.cursor = "crosshair";
    } else {
      setEraserMode(true);
      setIsPencilThicknessSliderShown(false);
      changeEraserCursor();
    }
  };

  const onChangeQuestionGrade = (event) => {
    setQuestionGrade(event.target.value);
  };

  const onChangeQuestionCategory = (event) => {
    setQuestionCategory(event.target.value);
  };

  const sidebarOpenBackgroundShow = () => {
    sidebarOpenBackground.current.style.position = "fixed";
  };

  const canvasAnswerLargeBackgroundShow = () => {
    canvasAnswerLargeBackground.current.style.position = "fixed";
  };

  const btnCloseSidebar = () => {
    sidebar.current.style.width = "0";
    sidebar.current.style.marginLeft = "-250px";
  };

  const sidebarOpenBackgroundHide = () => {
    sidebarOpenBackground.current.style.position = "unset";
    btnCloseSidebar();
  };

  const canvasAnswerLargeBackgroundHide = () => {
    canvasAnswerLargeBackground.current.style.position = "unset";
    setIsCanvasAnswerLargeShown(false);
  };

  const btnOpenSiderbar = () => {
    sidebar.current.style.width = "200px";
    sidebar.current.style.marginLeft = "0";
    sidebarOpenBackgroundShow();
  };

  useEffect(() => {
    const elements = Array.from(document.getElementsByClassName("sidebarOpenBackground"));
    elements[0].onclick = sidebarOpenBackgroundHide;
    elements[0].style.cursor = "pointer";
  }, []);

  useEffect(() => {
    const elements = Array.from(document.getElementsByClassName("canvasAnswerLargeBackground"));
    elements[0].onclick = canvasAnswerLargeBackgroundHide;
    elements[0].style.cursor = "pointer";
  }, []);

  const btnTimerIncrementMinutes = () => {
    if (inputTimerMinutes === 59) {
      setInputTimerMinutes(0);
    } else {
      setInputTimerMinutes(inputTimerMinutes + 1);
    }
  };

  const btnTimerDecrementMinutes = () => {
    if (inputTimerMinutes === 0) {
      setInputTimerMinutes(59);
    } else {
      setInputTimerMinutes(inputTimerMinutes - 1);
    }
  };

  const btnTimerIncrementSeconds = () => {
    if (inputTimerSeconds === 59) {
      setInputTimerSeconds(0);
    } else {
      setInputTimerSeconds(inputTimerSeconds + 1);
    }
  };

  const btnTimerDecrementSeconds = () => {
    if (inputTimerSeconds === 0) {
      setInputTimerSeconds(59);
    } else {
      setInputTimerSeconds(inputTimerSeconds - 1);
    }
  };

  const canvasAnswerLargeShow = (canvasNumber) => {
    switch (canvasNumber) {
      case 1:
        setCanvasLargeAnswer(img1);
        break;
      case 2:
        setCanvasLargeAnswer(img2);
        break;
      case 3:
        setCanvasLargeAnswer(img3);
        break;
      case 4:
        setCanvasLargeAnswer(img4);
        break;
      case 5:
        setCanvasLargeAnswer(img5);
        break;
      case 6:
        setCanvasLargeAnswer(img6);
        break;
      case 7:
        setCanvasLargeAnswer(img7);
        break;
      case 8:
        setCanvasLargeAnswer(img8);
        break;
      default:
        break;
    }
    setIsCanvasAnswerLargeShown(true);
    canvasAnswerLargeBackgroundShow();
  };

  function closeAllModals() {
    setIsModalTimerOpen(false);
    setIsSnackbarOpen(false);
    setIsColorPickerShown(false);
    setIsCanvasAnswerLargeShown(false);
    canvasAnswerLargeBackgroundHide();
    sidebar.current.style.width = "0";
    sidebar.current.style.marginLeft = "-250px";
    sidebarOpenBackground.current.style.position = "unset";
  }

  function save() {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  useHotkeys("escape", () => closeAllModals());

  return (
    <div className="main">
      <div ref={sidebarOpenBackground} className="sidebarOpenBackground" />
      <div ref={sidebar} className="sidebar">
        <div role="button" tabIndex="-1" onClick={onClickCopyInvite}>
          Copy invite link
        </div>
        <div className="btnLeaveRoom" role="button" tabIndex="-1" onClick={onClickLeaveRoom}>
          Leave room
        </div>
      </div>
      {isCanvasAnswerLargeShown ? (
        <img className="canvasAnswerLarge" alt="Answer canvas" src={canvasLargeAnswer} />
      ) : (
        <div />
      )}
      <div ref={canvasAnswerLargeBackground} className="canvasAnswerLargeBackground" />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isSnackbarOpen}
        onClose={snackbarClose}
        autoHideDuration={3000}
        message="Copied invite link"
      />
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
      <div>
        <div className="columnCanvas" style={{ display: "none" }}>
          <canvas
            ref={canvasCacheRef}
            width={canvasWidth}
            height={canvasHeight}
            className="canvas"
          />
        </div>
      </div>
      <div className="flex-container">
        <div className="flex-container-left">
          <div className="flex-container-canvas-outer">
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
            <div className="flex-container-canvas">
              <div ref={gridCanvasRef} className="grid-canvas">
                <canvas
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="canvas cdiv1"
                />
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
                  onClick={() => save()}
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
              </div>
            </div>
            <div className="flex-container-question-answer">
              {isQuestionShown ? (
                <h3 className="text-center question">{question}</h3>
              ) : (
                <h3 className="text-center answer">{answer}</h3>
              )}
            </div>
          </div>
        </div>
        <div className="flex-container-right">
          {picker}
          {username1 === "Player 1" ? (
            <div className="flex-container-answers-username-controls container-empty-user">
              <h2 className="placeholder-empty-user">EMPTY</h2>
            </div>
          ) : (
            <>
              <div className="flex-container-answers-username-controls">
                <div className="flex-container-answer-image">
                  <GradeImages grade1={user1_grade1} grade2={user1_grade2} grade3={user1_grade3} />
                  <img ref={refImg1} className="canvasAnswer" alt="Answer canvas" src={img1} />
                </div>
                <div className="flex-container-username-controls">
                  <div className="parent">
                    <p title="Username" className="username div1">
                      {username1}
                    </p>
                    <button
                      type="button"
                      title="Enlarge answer"
                      className="btn btnCanvasAnswerLarge div2"
                      disabled={isBtnCanvasAnswerLarge1Disabled}
                      onClick={() => canvasAnswerLargeShow(1)}
                    >
                      <i className="fas fa-expand" />
                    </button>
                    {isUserRoomMaster ? (
                      <GradeButtons
                        value="1"
                        incrementFails={incrementFails}
                        decrementFails={decrementFails}
                        disabled={isBtnF1Disabled}
                      />
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {username2 === "Player 2" ? (
            <div className="flex-container-answers-username-controls container-empty-user">
              <h2 className="placeholder-empty-user">EMPTY</h2>
            </div>
          ) : (
            <>
              <div className="flex-container-answers-username-controls">
                <div className="flex-container-answer-image">
                  <GradeImages grade1={user2_grade1} grade2={user2_grade2} grade3={user2_grade3} />
                  <img ref={refImg2} className="canvasAnswer" alt="Answer canvas" src={img2} />
                </div>
                <div className="flex-container-username-controls">
                  <div className="parent">
                    <p title="Username" className="username div1">
                      {username2}
                    </p>
                    <button
                      type="button"
                      title="Enlarge answer"
                      className="btn btnCanvasAnswerLarge div2"
                      disabled={isBtnCanvasAnswerLarge2Disabled}
                      onClick={() => canvasAnswerLargeShow(2)}
                    >
                      <i className="fas fa-expand" />
                    </button>
                    {isUserRoomMaster ? (
                      <GradeButtons
                        value="2"
                        incrementFails={incrementFails}
                        decrementFails={decrementFails}
                        disabled={isBtnF2Disabled}
                      />
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {username3 === "Player 3" ? (
            <div className="flex-container-answers-username-controls container-empty-user">
              <h2 className="placeholder-empty-user">EMPTY</h2>
            </div>
          ) : (
            <>
              <div className="flex-container-answers-username-controls">
                <div className="flex-container-answer-image">
                  <GradeImages grade1={user3_grade1} grade2={user3_grade2} grade3={user3_grade3} />
                  <img ref={refImg3} className="canvasAnswer" alt="Answer canvas" src={img3} />
                </div>
                <div className="flex-container-username-controls">
                  <div className="parent">
                    <p title="Username" className="username div1">
                      {username3}
                    </p>
                    <button
                      type="button"
                      title="Enlarge answer"
                      className="btn btnCanvasAnswerLarge div2"
                      disabled={isBtnCanvasAnswerLarge3Disabled}
                      onClick={() => canvasAnswerLargeShow(3)}
                    >
                      <i className="fas fa-expand" />
                    </button>
                    {isUserRoomMaster ? (
                      <GradeButtons
                        value="3"
                        incrementFails={incrementFails}
                        decrementFails={decrementFails}
                        disabled={isBtnF3Disabled}
                      />
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {username4 === "Player 4" ? (
            <div className="flex-container-answers-username-controls container-empty-user">
              <h2 className="placeholder-empty-user">EMPTY</h2>
            </div>
          ) : (
            <>
              <div className="flex-container-answers-username-controls">
                <div className="flex-container-answer-image">
                  <GradeImages grade1={user4_grade1} grade2={user4_grade2} grade3={user4_grade3} />
                  <img ref={refImg4} className="canvasAnswer" alt="Answer canvas" src={img4} />
                </div>
                <div className="flex-container-username-controls">
                  <div className="parent">
                    <p title="Username" className="username div1">
                      {username4}
                    </p>
                    <button
                      type="button"
                      title="Enlarge answer"
                      className="btn btnCanvasAnswerLarge div2"
                      disabled={isBtnCanvasAnswerLarge4Disabled}
                      onClick={() => canvasAnswerLargeShow(4)}
                    >
                      <i className="fas fa-expand" />
                    </button>
                    {isUserRoomMaster ? (
                      <GradeButtons
                        value="4"
                        incrementFails={incrementFails}
                        decrementFails={decrementFails}
                        disabled={isBtnF4Disabled}
                      />
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {username5 === "Player 5" ? (
            <div className="flex-container-answers-username-controls container-empty-user">
              <h2 className="placeholder-empty-user">EMPTY</h2>
            </div>
          ) : (
            <>
              <div className="flex-container-answers-username-controls">
                <div className="flex-container-answer-image">
                  <GradeImages grade1={user5_grade1} grade2={user5_grade2} grade3={user5_grade3} />
                  <img ref={refImg5} className="canvasAnswer" alt="Answer canvas" src={img5} />
                </div>
                <div className="flex-container-username-controls">
                  <div className="parent">
                    <p title="Username" className="username div1">
                      {username5}
                    </p>
                    <button
                      type="button"
                      title="Enlarge answer"
                      className="btn btnCanvasAnswerLarge div2"
                      disabled={isBtnCanvasAnswerLarge5Disabled}
                      onClick={() => canvasAnswerLargeShow(5)}
                    >
                      <i className="fas fa-expand" />
                    </button>
                    {isUserRoomMaster ? (
                      <GradeButtons
                        value="5"
                        incrementFails={incrementFails}
                        decrementFails={decrementFails}
                        disabled={isBtnF5Disabled}
                      />
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {username6 === "Player 6" ? (
            <div className="flex-container-answers-username-controls container-empty-user">
              <h2 className="placeholder-empty-user">EMPTY</h2>
            </div>
          ) : (
            <>
              <div className="flex-container-answers-username-controls">
                <div className="flex-container-answer-image">
                  <GradeImages grade1={user6_grade1} grade2={user6_grade2} grade3={user6_grade3} />
                  <img ref={refImg6} className="canvasAnswer" alt="Answer canvas" src={img6} />
                </div>
                <div className="flex-container-username-controls">
                  <div className="parent">
                    <p title="Username" className="username div1">
                      {username6}
                    </p>
                    <button
                      type="button"
                      title="Enlarge answer"
                      className="btn btnCanvasAnswerLarge div2"
                      disabled={isBtnCanvasAnswerLarge6Disabled}
                      onClick={() => canvasAnswerLargeShow(6)}
                    >
                      <i className="fas fa-expand" />
                    </button>
                    {isUserRoomMaster ? (
                      <GradeButtons
                        value="6"
                        incrementFails={incrementFails}
                        decrementFails={decrementFails}
                        disabled={isBtnF6Disabled}
                      />
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          {username7 === "Player 7" ? (
            <div className="flex-container-answers-username-controls container-empty-user">
              <h2 className="placeholder-empty-user">EMPTY</h2>
            </div>
          ) : (
            <>
              <div className="flex-container-answers-username-controls">
                <div className="flex-container-answer-image">
                  <GradeImages grade1={user7_grade1} grade2={user7_grade2} grade3={user7_grade3} />
                  <img ref={refImg7} className="canvasAnswer" alt="Answer canvas" src={img7} />
                </div>
                <div className="flex-container-username-controls">
                  <div className="parent">
                    <p title="Username" className="username div1">
                      {username7}
                    </p>
                    <button
                      type="button"
                      title="Enlarge answer"
                      className="btn btnCanvasAnswerLarge div2"
                      disabled={isBtnCanvasAnswerLarge7Disabled}
                      onClick={() => canvasAnswerLargeShow(7)}
                    >
                      <i className="fas fa-expand" />
                    </button>
                    {isUserRoomMaster ? (
                      <GradeButtons
                        value="7"
                        incrementFails={incrementFails}
                        decrementFails={decrementFails}
                        disabled={isBtnF7Disabled}
                      />
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          {username8 === "Player 8" ? (
            <div className="flex-container-answers-username-controls container-empty-user">
              <h2 className="placeholder-empty-user">EMPTY</h2>
            </div>
          ) : (
            <>
              <div className="flex-container-answers-username-controls">
                <div className="flex-container-answer-image">
                  <GradeImages grade1={user8_grade1} grade2={user8_grade2} grade3={user8_grade3} />
                  <img ref={refImg8} className="canvasAnswer" alt="Answer canvas" src={img8} />
                </div>
                <div className="flex-container-username-controls">
                  <div className="parent">
                    <p title="Username" className="username div1">
                      {username8}
                    </p>
                    <button
                      type="button"
                      title="Enlarge answer"
                      className="btn btnCanvasAnswerLarge div2"
                      disabled={isBtnCanvasAnswerLarge8Disabled}
                      onClick={() => canvasAnswerLargeShow(8)}
                    >
                      <i className="fas fa-expand" />
                    </button>
                    {isUserRoomMaster ? (
                      <GradeButtons
                        value="8"
                        incrementFails={incrementFails}
                        decrementFails={decrementFails}
                        disabled={isBtnF8Disabled}
                      />
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
