// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyCRUwSzViWPZ93qZjLiojEvss1_9YmaO1o",
  authDomain: "instagram-clone-e9d9c.firebaseapp.com",
  databaseURL: "https://instagram-clone-e9d9c-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-e9d9c",
  storageBucket: "instagram-clone-e9d9c.appspot.com",
  messagingSenderId: "764766914683",
  appId: "1:764766914683:web:f744167b3a55db56b37ade",
  measurementId: "G-7QZ3J6HCBR",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
