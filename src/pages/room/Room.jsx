/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable func-names */
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { SketchPicker } from "react-color";
import Snackbar from "@mui/material/Snackbar";
import ws from "../../socket/ws.js";
import blackBoardImage from "../../media/blackboard.jpg";
import GradeButtons from "../../components/GradeButtons/GradeButtons.jsx";
import GradeImages from "../../components/GradeImages/GradeImages.jsx";
import { baseUrl, inviteUrl } from "../../config/url";
import GameControl from "../../components/GameControls/GameControls.jsx";
import CanvasControls from "../../components/CanvasControls/CanvasControls.jsx";
import ModalEditTimer from "../../components/ModalEditTimer/ModalEditTimer.jsx";
import "./room.css";

export default function Room() {
  const navigate = useNavigate();
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
  const [usersArray, setUsersArray] = useState([]);
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
  const [isCanvasAnswerLargeShown, setIsCanvasAnswerLargeShown] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);

  function midPointBetween(p1, p2) {
    return {
      x: p1.x + (p2.x - p1.x) / 2,
      y: p1.y + (p2.y - p1.y) / 2,
    };
  }

  useEffect(() => {
    if (canvasRef.current !== null) {
      setCanvasWidth(canvasRef.current.clientWidth - 2);
      setCanvasHeight(canvasRef.current.clientHeight - 2);
      setCanvasStates([
        new ImageData(canvasRef.current.clientWidth - 2, canvasRef.current.clientHeight - 2),
      ]);
    }
  }, [usersArray]);

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
            }
          });
          setUsersArray(users);
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
      if (canvasRef.current !== null) {
        const ctx = canvasRef.current.getContext("2d");
        const ctxCache = canvasCacheRef.current.getContext("2d");
        const imageData = ctx.getImageData(
          0,
          0,
          canvasRef.current.clientWidth,
          canvasRef.current.clientHeight
        );
        setCanvasWidth(canvasRef.current.clientWidth - 2);
        setCanvasHeight(canvasRef.current.clientHeight - 2);
        ctx.putImageData(imageData, 0, 0);
        ctxCache.putImageData(imageData, 0, 0);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (canvasRef.current !== null) {
      window.addEventListener("scroll", () => {
        const boundingRect = canvasRef.current.getBoundingClientRect();
        offsetX = boundingRect.left;
        offsetY = boundingRect.top;
      });
    }
  });

  useEffect(() => {
    if (canvasRef.current !== null) {
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
    }
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
    if (elements[0] !== undefined) {
      if (isUserRoomMaster) {
        elements[0].onclick = modalEditTimerOpen;
        elements[0].style.cursor = "pointer";
        elements[0].title = "Change timer";
      }
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
      setImg1(blackBoardImage);
      setImg2(blackBoardImage);
      setImg3(blackBoardImage);
      setImg4(blackBoardImage);
      setImg5(blackBoardImage);
      setImg6(blackBoardImage);
      setImg7(blackBoardImage);
      setImg8(blackBoardImage);
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
      setUsersArray(data.users);
    });

    ws.on("confirm-decrement", (data) => {
      setUsersArray(data.users);
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
          break;
      }
    });

    ws.on("user-join", (data) => {
      setUsersArray(data.users);
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

  const nextQuestion = () => {
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
    navigate("/", { replace: true });
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
    if (elements[0] !== undefined) {
      elements[0].onclick = sidebarOpenBackgroundHide;
      elements[0].style.cursor = "pointer";
    }
  }, [usersArray]);

  useEffect(() => {
    const elements = Array.from(document.getElementsByClassName("canvasAnswerLargeBackground"));
    if (elements[0] !== undefined) {
      elements[0].onclick = canvasAnswerLargeBackgroundHide;
      elements[0].style.cursor = "pointer";
    }
  }, [usersArray]);

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

  const closeAllModals = () => {
    setIsModalTimerOpen(false);
    setIsSnackbarOpen(false);
    setIsColorPickerShown(false);
    setIsCanvasAnswerLargeShown(false);
    canvasAnswerLargeBackgroundHide();
    sidebar.current.style.width = "0";
    sidebar.current.style.marginLeft = "-250px";
    sidebarOpenBackground.current.style.position = "unset";
  };

  const save = () => {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  useHotkeys("escape", () => closeAllModals());

  const players = [];
  if (usersArray[0] !== undefined) {
    let numberOfIterations;
    if (usersArray[0].userId === 0) {
      numberOfIterations = 9;
    } else {
      numberOfIterations = 8;
    }

    for (let i = 0; i < numberOfIterations; i += 1) {
      if (usersArray[i] === undefined) {
        players.push(
          <div key={i} className="flex-container-answers-username-controls container-empty-user">
            <h2 className="placeholder-empty-user">EMPTY</h2>
          </div>
        );
      } else {
        if (usersArray[i].userId === 0) {
          // eslint-disable-next-line no-continue
          continue;
        }
        players.push(
          <>
            <div key={i} className="flex-container-answers-username-controls">
              <div className="flex-container-answer-image">
                <GradeImages failCount={usersArray[i].failCount} />
                <img
                  ref={eval(`refImg${usersArray[i].userId}`)}
                  className="canvasAnswer"
                  alt="Answer canvas"
                  src={eval(`img${usersArray[i].userId}`)}
                />
              </div>
              <div className="flex-container-username-controls">
                <div className="parent">
                  <p title="Username" className="username div1">
                    {usersArray[i].username}
                  </p>
                  <button
                    type="button"
                    title="Enlarge answer"
                    className="btn btnCanvasAnswerLarge div2"
                    disabled={eval(`isBtnCanvasAnswerLarge${usersArray[i].userId}Disabled`)}
                    onClick={() => canvasAnswerLargeShow(usersArray[i].userId)}
                  >
                    <i className="fas fa-expand" />
                  </button>
                  {isUserRoomMaster ? (
                    <GradeButtons user={usersArray[i]} setUsersArray={setUsersArray} />
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </div>
          </>
        );
      }
    }
  }

  return (
    <div>
      {usersArray[0] === undefined ? (
        <></>
      ) : (
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
            autoHideDuration={2000}
            message="Copied invite link"
          />
          <ModalEditTimer
            isModalEditTimerOpen={isModalEditTimerOpen}
            modalEditTimerClose={modalEditTimerClose}
            btnTimerIncrementMinutes={btnTimerIncrementMinutes}
            btnTimerDecrementMinutes={btnTimerDecrementMinutes}
            inputTimerMinutes={inputTimerMinutes}
            setInputTimerMinutes={setInputTimerMinutes}
            btnTimerIncrementSeconds={btnTimerIncrementSeconds}
            btnTimerDecrementSeconds={btnTimerDecrementSeconds}
            inputTimerSeconds={inputTimerSeconds}
            setInputTimerSeconds={setInputTimerSeconds}
          />
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
                <GameControl
                  btnOpenSiderbar={btnOpenSiderbar}
                  isUserRoomMaster={isUserRoomMaster}
                  isGameStarted={isGameStarted}
                  startGame={startGame}
                  onClickRevealAnswer={onClickRevealAnswer}
                  nextQuestion={nextQuestion}
                  timerRef={timerRef}
                  onTimerComplete={onTimerComplete}
                  timer={timer}
                  questionGrade={questionGrade}
                  onChangeQuestionGrade={onChangeQuestionGrade}
                  questionCategory={questionCategory}
                  onChangeQuestionCategory={onChangeQuestionCategory}
                />
                <div className="flex-container-canvas">
                  <div ref={gridCanvasRef} className="grid-canvas">
                    <canvas
                      ref={canvasRef}
                      width={canvasWidth}
                      height={canvasHeight}
                      className="canvas cdiv1"
                    />
                    <CanvasControls
                      setDrawingMode={setDrawingMode}
                      onUndo={onUndo}
                      setIsColorPickerShown={setIsColorPickerShown}
                      isColorPickerShown={isColorPickerShown}
                      save={save}
                      clearCanvas={clearCanvas}
                      isPencilThicknessSliderShown={isPencilThicknessSliderShown}
                      pencilThickness={pencilThickness}
                      setPencilThickness={setPencilThickness}
                      eraserThickness={eraserThickness}
                      onChangeEraserThickness={onChangeEraserThickness}
                      isUserRoomMaster={isUserRoomMaster}
                      isRoomMasterParticipating={isRoomMasterParticipating}
                      isBtnLockInDisabled={isBtnLockInDisabled}
                      onClickLockIn={onClickLockIn}
                    />
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
              {players}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
