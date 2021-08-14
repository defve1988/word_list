import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import User from "@/app_class/user";

// function login_user(state, user) {
//    state.username = user.displayName;
//    state.islogin = true;
//    state.userPhoto = user.photoURL;
//    state.register_dialog = false;
//    state.ref = state.db.collection("users").doc(state.auth.currentUser.uid).collection("word_list")
// }

// function reset_user(state) {
//    state.islogin = false;
//    state.username = "";
//    state.userPhoto = null;
// }

// function init_user_collection(state, username = null) {
//    var UserID = state.auth.currentUser.uid
//    if (username == null) {
//       username = state.auth.currentUser.displayName
//    }
//    const {
//       serverTimestamp
//    } = firebase.firestore.FieldValue;
//    state.db.collection("users").where("uid", "==", UserID)
//       .get()
//       .then((querySnapshot) => {
//          // console.log(querySnapshot)
//          if (querySnapshot.empty) {
//             state.db.collection("users").doc(UserID).set({
//                   uid: UserID,
//                   username: username,
//                   createdAt: serverTimestamp(),
//                   lastUpdated: serverTimestamp()
//                }).then(() => {
//                   console.log("User collection successfully written!");
//                })
//                .catch((error) => {
//                   console.error("Error writing document: ", error);
//                });
//          }
//       })
//       .catch((error) => {
//          console.log("Error getting documents: ", error);
//       });
// }

// function get_language(state) {
//    var userID = state.auth.currentUser.uid
//    state.db.collection("users").doc(userID)
//       .get()
//       .then((res) => {
//          state.selected_language = res.data().languages
//       })
// }

const state = {
   user: new User(),
   register_dialog: false,
   // first_created: false,
   // username: "",
   // userPhoto: null,
   // islogin: false,
   // auth: firebase.auth(),
   // db: firebase.firestore(),
   // ref: null,
   // provider_google: new firebase.auth.GoogleAuthProvider(),
   // selected_language: null,
};

// if already login
state.auth.onAuthStateChanged((user) => {
   // console.log(user)
   if (user != null) {
      state.username = user.displayName;
      state.userPhoto = user.photoURL;
      state.islogin = true;
      login_user(state, user)
      get_language(state)
   } else {
      // not signed in
      reset_user(state)
   }
})

const getters = {

};

const actions = {

};

const mutations = {
   async TEST(state) {
      // var res = await state.test_user.check_invitation("199201")
      // console.log(res)
      state.test_user.selected_language=[1,2,3]
      state.test_user.get_language()
      console.log(state.test_user.selected_language)
   },
   UPDATE_LAN(state) {
      var userID = state.auth.currentUser.uid
      // console.log(userID)
      state.db.collection("users").doc(userID).set({
            "languages": state.selected_language
         }, {
            merge: true
         })
         .then(() => {
            console.log("Language successfully updated!");
         })
         .catch((error) => {
            console.error("Error writing document: ", error);
         });
   },

   LOGIN(state, new_user) {
      if (new_user.loginType == "google") {
         state.auth.signInWithPopup(state.provider_google)
            .then(() => {
               // console.log(user)
               state.db.collection("users").where("uid", "==", state.auth.currentUser.uid)
                  .get()
                  .then((res) => {
                     if (res.empty) {
                        firebase.auth().currentUser.delete()
                        reset_user(state)
                        alert("Not a registered user.")
                     }
                  })
            })
            .catch((error) => {
               alert(error)
               reset_user(state)
            });
      } else if (new_user.loginType == "email") {
         state.auth.signInWithEmailAndPassword(new_user.email, new_user.pwd)
            .catch((error) => {
               alert(error)
               reset_user(state)
            });
      }
   },

   REGISTER(state, new_user) {
      // if valid invitation code
      state.db.collection("invitation")
         .where("code", "==", new_user.invitation)
         .get()
         .then((querySnapshot) => {
            return new Promise((resolve) => {
               if (querySnapshot.empty) {
                  return resolve(false);
               } else {
                  return resolve(true);
               }
            });
         })
         .then((invited) => {
            // if invited then created new user
            // console.log(invited)
            if (invited) {
               if (new_user.RegisterType == "google") {
                  state.auth.signInWithPopup(state.provider_google)
                     .then((user) => {
                        login_user(state, user)
                        init_user_collection(state);
                        state.first_created = true
                        alert("New user registered!")
                     })
                     .catch((error) => {
                        alert(error)
                        reset_user(state)
                     });
               } else if (new_user.RegisterType == "email") {
                  state.auth.createUserWithEmailAndPassword(new_user.email, new_user.pwd)
                     .then(() => {
                        state.auth.currentUser.updateProfile({
                           displayName: new_user.username
                        })
                     })
                     .then(() => {
                        let user = state.auth.currentUser
                        // console.log(user)
                        login_user(state, user)
                        init_user_collection(state, new_user.username);
                        state.first_created = true
                        alert("New user registered!")
                     })
                     .catch((error) => {
                        alert(error)
                        reset_user(state)
                     });
               }
            } else {
               alert("Not a valid invitation code.")
            }
         })
   },

   LOGOUT(state) {
      reset_user(state)
      state.auth.signOut();
   },

};

export default {
   state,
   getters,
   actions,
   mutations
};