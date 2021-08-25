import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Login from "./Login";

import { auth } from "./Firebase";
import { useStateValue } from "./StateProvider";
function App() {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  useEffect(() => {
    // will only run once when the app component loads...

    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // the user just logged in / the user was logged in

        const { displayName, email, photoURL, uid } = authUser;

        dispatch({
          type: "SET_USER",
          user: {
            name: displayName,
            email: email,
            img: photoURL,
            uid: uid,
          },
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (
    // eslint-disable-next-line no-unreachable
    <Router>
      <div className="App">
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
