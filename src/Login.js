import React from "react";
import "./Login.css";
import firebase from "firebase";
import { auth, db } from "./Firebase";
import { useStateValue } from "./StateProvider";
import { useHistory } from "react-router-dom";

export default function Login() {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const Login = async (e) => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth
      .signInWithPopup(provider)
      .then((res) => {
        db.collection("users")
          .doc(res.user.uid)
          .set({
            name: res.user.displayName,
            email: res.user.email,
            img: res.user.photoURL,
            uid: res.user.uid,
            isOnline: true,
          })
          .then(() => {
            console.log("Document is writtem");
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
        history.push("/home");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <div>
      <form className="w3-center form">
        <button className="w3-card w3-btn w3-xxlarge w3-blue" onClick={Login}>
          Login with Google
        </button>
      </form>
    </div>
  );
}
