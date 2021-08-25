import firebase from "firebase";

const firebaseConfig = {
  //Your api config file goes here
    apiKey: "AIzaSyDrHBypWLlLMLDWOt6a69yp-e71nDpiwXU",
  authDomain: "chatapp-6ff8a.firebaseapp.com",
  projectId: "chatapp-6ff8a",
  storageBucket: "chatapp-6ff8a.appspot.com",
  messagingSenderId: "421256198262",
  appId: "1:421256198262:web:41d8452a6ed1d45f6e0757",
  measurementId: "G-J2HE4NB6EG"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
export { db, auth };
