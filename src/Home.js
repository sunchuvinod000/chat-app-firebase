/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./Home.css";
import { auth, db } from "./Firebase";
import { useStateValue } from "./StateProvider";
import { useHistory } from "react-router-dom";

const User = (props) => {
  const { user, onClick } = props;

  return (
    <div onClick={() => onClick(user)} className="displayName">
      <div className="displayPic">
        <img src={user.img} alt="" />
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
          margin: "0 10px",
        }}
      >
        <span style={{ fontWeight: 500 }}>{user.name}</span>
        <span className={user.isOnline ? "w3-text-teal" : ""}>
          {user.isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [{ user, allUsers, conversations }, dispatch] = useStateValue();
  const history = useHistory();

  const [chatStarted, setChatStarted] = useState(false);
  const [chatUser, setChatUser] = useState("");
  const [message, setMessage] = useState();
  const [userUid, setuserUid] = useState();
  const [another_user, setAnother_user] = useState();
  useEffect(async () => {
    await db
      .collection("users")
      .get()
      .then((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().uid !== user?.uid) {
            users.push(doc.data());
          }
        });
        dispatch({
          type: "USERS",
          allUsers: users,
        });
      });
  }, [allUsers]);

  const initChat = (user_clicked) => {
    setChatStarted(true);
    setChatUser(user_clicked.name);
    setuserUid(user_clicked.uid);
    setAnother_user(user_clicked);
    db.collection("conversations")
      .where("user_uid_1", "in", [user.uid, user_clicked.uid])
      .orderBy("createdAt", "asc")
      .onSnapshot((querySnapshot) => {
        const conversations = [];
        querySnapshot.forEach((doc) => {
          if (
            (doc.data().user_uid_1 === user.uid &&
              doc.data().user_uid_2 === user_clicked.uid) ||
            (doc.data().user_uid_1 === user_clicked.uid &&
              doc.data().user_uid_2 === user.uid)
          ) {
            conversations.push(doc.data());
          }
          if (conversations.length > 0) {
            dispatch({
              type: "CONVERSATIONS",
              conversations: conversations,
            });
          } else {
            dispatch({
              type: "CONVERSATIONS",
              conversations: [],
            });
          }
        });
      });
  };

  const sendMessage = async () => {
    const msgobj = {
      user_uid_1: user.uid,
      user_uid_2: userUid,
      message,
    };
    if (message !== "") {
      await db
        .collection("conversations")
        .add({
          ...msgobj,
          isView: false,
          createdAt: new Date(),
        })
        .then((data) => {
          console.log("message is added to frebase", data);
        })
        .catch((error) => {
          console.log(error);
        });
      setMessage("");
      initChat(another_user);
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    await db.collection("users").doc(user.uid).update({ isOnline: false });

    auth.signOut();
    history.push("/");
  };

  return (
    <div>
      <div className="w3-card w3-blue">
        <div className="w3-bar">
          <div className="w3-bar-item w3-xxlarge " style={{ width: "33%" }}>
            Chat-App
          </div>
          <div className="w3-bar-item w3-xxlarge" style={{ width: "33%" }}>
            {user?.name}
          </div>
          <div
            className="w3-bar-item w3-margin w3-large w3-btn w3-hover-white w3-right"
            onClick={logout}
          >
            Logout
          </div>
        </div>
      </div>
      <section className="container">
        <div className="listOfUsers">
          {allUsers?.length > 0 ? (
            allUsers?.map((item) => {
              return <User onClick={initChat} key={item.uid} user={item} />;
            })
          ) : (
            <p>No users here</p>
          )}
        </div>
        <div className="chatArea">
          <div className="chatHeader ">
            <h3> {chatStarted ? chatUser : null} </h3>
          </div>
          <div className="messageSections">
            {chatStarted
              ? conversations?.map((con) => (
                  <div
                    style={{
                      textAlign:
                        con.user_uid_1 === user?.uid ? "right" : "left",
                    }}
                  >
                    <p className="messageStyle">{con.message}</p>
                  </div>
                ))
              : null}
          </div>
          {chatStarted ? (
            <div className="chatControls">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="type here..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
