import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';


export default class userAuth {
   constructor() {
      this.db = firebase.firestore().collection("users")
      this.user = null
      this.user_ref = null
      firebase.auth().onAuthStateChanged(() => {
         this.user = firebase.auth().currentUser
         if (this.user != null) this.user_ref = this.db.doc(this.user.uid)
      })
   }

   async register(new_user) {
      // new_user:
      // {email: this.email,
      //   pwd: this.pwd,
      // username: this.username,
      // RegisterType: RegisterType,
      // invitationCode: str}
      try {
         let isValid = await this.check_invitation(new_user.invitationCode)
         if (isValid) {
            if (new_user.RegisterType == "google") {
               let provider_google = new firebase.auth.GoogleAuthProvider()
               await firebase.auth().signInWithPopup(provider_google)
            } else if (new_user.RegisterType == "email") {
               await firebase.auth().createUserWithEmailAndPassword(new_user.email, new_user.pwd)
               await this.user.updateProfile({
                  displayName: new_user.username
               })
               // make sure the UI can be correctly displayed
               await this.logout()
               await this.login(new_user)
            }
            alert("New user is registered.")
            return Promise.resolve("registered")
         } else {
            alert("note a valid code.")
         }
      } catch (error) {
         console.error("Error when registering new user:", error);
         alert(error)
         return Promise.reject(error);
      }
   }

   async login(user) {
      // user:
      // {email: this.email,
      //   pwd: this.pwd,
      // loginType: RegisterType,}

      try {
         if (user.loginType == "google") {
            let provider_google = new firebase.auth.GoogleAuthProvider()
            await firebase.auth().signInWithPopup(provider_google)

            let res = await firebase.firestore()
               .collection("users")
               .where("uid", "==", this.user.uid).get()
            if (res.empty) {
               await this.user.delete()
               await firebase.auth().signOut()
               alert("Not a registered user.")
            }

         } else if (user.loginType == "email") {
            await firebase.auth().signInWithEmailAndPassword(user.email, user.pwd)
         }
         return Promise.resolve("login")
      } catch (error) {
         console.error("Error when login:", error);
         return Promise.reject(error);
      }
   }

   async logout() {
      try {
         await firebase.auth().signOut()
         console.log("sign out successfully");
         return Promise.resolve("sign out successfully.")
      } catch (error) {
         console.error("Error when sign out:", error);
         return Promise.reject(error);
      }
   }


   async check_invitation(code) {
      try {
         let querySnapshot = await firebase.firestore().collection("invitation").where("code", "==", code).get()
         if (querySnapshot.empty) {
            return Promise.resolve(false)
         } else {
            return Promise.resolve(true)
         }
      } catch (error) {
         console.error("Error when validate code:", error);
         return Promise.reject(error);
      }
   }

}