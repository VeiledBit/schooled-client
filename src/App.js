/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/prop-types */
import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/home/Home";
import Room from "./pages/room/Room";
import JoinRoom from "./pages/joinRoom/JoinRoom";

function App() {
  return (
    <Router>
      <Switch>
        <PrivateRouteLoggedIn path="/" exact component={Home} />
        <PrivateRoute path="/room" exact component={Room} />
        <Route exact path="/joinRoom">
          <JoinRoom />
        </Route>
      </Switch>
    </Router>
  );
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      sessionStorage.getItem("roomCode") ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/" }} />
      )
    }
  />
);

const PrivateRouteLoggedIn = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      !sessionStorage.getItem("roomCode") ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/room" }} />
      )
    }
  />
);

export default App;
