import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';



export default class firebase_db {
   constructor() {
      this.db = firebase.firestore().collection("users")

      firebase.auth().onAuthStateChanged(() => {
         this.user = firebase.auth().currentUser
      })
   }

   async register(new_user) {
      // new_user:
      // {email: this.email,
      //   pwd: this.pwd,
      // username: this.username,
      // RegisterType: RegisterType,}
      try {
         if (new_user.RegisterType == "google") {
            let provider_google = new firebase.auth.GoogleAuthProvider()
            await firebase.auth().signInWithPopup(provider_google)
         } else if (new_user.RegisterType == "email") {
            await firebase.auth().createUserWithEmailAndPassword(new_user.email, new_user.pwd)
            await this.user.updateProfile({
               displayName: new_user.username
            })
         }
         alert("New user is registered.")
         return Promise.resolve("registered")
      } catch (error) {
         console.error("Error when registering new user:", error);
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
         return Promise.resolve("login successfully.")
      } catch (error) {
         console.error("Error when login:", error);
         return Promise.reject(error);
      }
   }

   async logout() {
      try {
         await firebase.auth().signOut()
         return Promise.resolve("sign out successfully.")
      } catch (error) {
         console.error("Error when sign out:", error);
         return Promise.reject(error);
      }
   }


   async check_invitation(code) {
      try{
         let querySnapshot = await firebase.firestore().collection("invitation").where("code", "==", code).get()
         if (querySnapshot.empty){
            console.log("not a validated code.")
            return Promise.resolve(false)
         }
         else{
            console.log("validated code.")
            return Promise.resolve(true)
         }
      }
      catch(error){
         console.error("Error when validate code:", error);
         return Promise.reject(error);
      }
   }




   async get_value(res, key) {
      try {
         return Promise.resolve(res.data()[key])
      } catch (error) {
         console.error("Error when getting values:", error);
         return Promise.reject(error);
      }
   }

   async update_prop(ref, prop) {
      try {
         await ref.update(prop)
         console.log("record changed.")
         return Promise.resolve()
      } catch (error) {
         console.error("Error when setting props:", error);
         return Promise.reject(error);
      }
   }



   async deleteCollection(db, collectionPath, batchSize) {
      const collectionRef = db.collection(collectionPath);
      const query = collectionRef.orderBy('__name__').limit(batchSize);

      return new Promise((resolve, reject) => {
         this.deleteQueryBatch(db, query, resolve).catch(reject);
      });
   }

   async deleteQueryBatch(db, query, resolve) {
      const snapshot = await query.get();

      const batchSize = snapshot.size;
      if (batchSize === 0) {
         // When there are no documents left, we are done
         resolve();
         return;
      }

      // Delete documents in a batch
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
         batch.delete(doc.ref);
      });
      await batch.commit();

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
         deleteQueryBatch(db, query, resolve);
      });
   }

}