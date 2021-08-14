import firebase from "firebase/app";
import "firebase/auth";

//  init firebase here

const firebaseConfig = {
   apiKey: "AIzaSyD8Yp-MQ41dOL-bf4A6TYJk9gHJsNdEm3E",
   authDomain: "wordlist-5957a.firebaseapp.com",
   projectId: "wordlist-5957a",
   storageBucket: "wordlist-5957a.appspot.com",
   messagingSenderId: "211889379265",
   appId: "1:211889379265:web:55915902a2b65038b48140",
   measurementId: "G-Y44B2YGE3Q"
 };
 firebase.initializeApp(firebaseConfig);

 export default{
   firebase
 }