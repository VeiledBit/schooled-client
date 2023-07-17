/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Room from "./pages/room/Room";
import JoinRoom from "./pages/joinRoom/JoinRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          exact
          element={
            <PrivateRouteLoggedIn>
              <Home />
            </PrivateRouteLoggedIn>
          }
        />
        <Route
          path="/room"
          exact
          element={
            <PrivateRoute>
              <Room />
            </PrivateRoute>
          }
        />
        <Route exact path="/joinRoom" element={<JoinRoom />} />
      </Routes>
    </Router>
  );
}

function PrivateRoute({ children }) {
  const roomCode = sessionStorage.getItem("roomCode");

  if (roomCode === null) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PrivateRouteLoggedIn({ children }) {
  const roomCode = sessionStorage.getItem("roomCode");

  if (roomCode !== null) {
    return <Navigate to="/room" replace />;
  }

  return children;
}

export default App;
