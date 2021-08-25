import firebase from "firebase";

const firebaseConfig = {
  //Your api config file goes here
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
export { db, auth };
