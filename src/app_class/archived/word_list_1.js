import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';

import world_language from "@/app_class/languages"


export default class User {
   constructor(user) {
      this.user = user
      this.uid = user.uid
      this.username = user.displayName

      this.world_language = world_language.world_language
      this.ref = null
      this.init_collection()
      this.word_list = []
   }

   init_collection() {
      this.ref = firebase.firestore().collection("users").doc(this.uid).collection("word_list")
   }

   update_lan(selected_language) {
      // update firestore values
      firebase.firestore().collection("users").doc(this.uid).set({
            "languages": selected_language
         }, {
            merge: true
         })
         .then(() => {
            console.log("Language successfully updated!");
         })
         .catch((error) => {
            console.error("Error writing document: ", error);
         });
   }

   get_language() {
      return firebase.firestore().collection("users").doc(this.uid)
         .get()
         .then((res) => {
            return new Promise((resolve) => {
               // if res.data()==null: user is not created
               if (res.data() != null) {
                  resolve(res.data().languages)
               } else {
                  resolve(null)
               }
            })
         })
   }

   new_word(selected_language) {
      let word = {
         "mastered": false,
         "learned": 0,
         "error": 0,
         "notebook": "default",
         "favorite": false,
         "last_tested": null,
         "notes": "",
      }
      selected_language.forEach(key => word[this.world_language[key].key] = "");

      return word
   }

   add_record(record, others) {
      const {
         serverTimestamp
      } = firebase.firestore.FieldValue;

      Object.keys(others).forEach(key => {
         record[key] = others[key]
      })
      record.createdAt = serverTimestamp()

      this.ref.where("en", "==", record.en)
         .get()
         .then(res => {
            if (res.empty) {
               this.ref.add(record)
                  .then(() => {
                     console.log("New record successfully added!");
                  })
                  .catch((error) => {
                     console.error("Error writing document: ", error);
                  });
            } else {
               console.log("Record already exists!");
            }
         })
         .catch((error) => {
            console.error("Error writing document: ", error);
         });
   }

   get_word_list() {
      this.word_list = []
      this.ref.get()
         .then(res => {
            res.forEach((doc) => {
               // doc.data() is never undefined for query doc snapshots
               let record = doc.data()
               record.id = doc.id
               record.mastered = false
               this.word_list.push(record)
            });
         })
   }

   set_record_prop(id, prop) {
      return this.ref.doc(id)
         .update(prop)
         .then(() => {
            console.log("record changed.")
            return new Promise((resolve) => {
               resolve(true)
            })
         })
         .catch((error) => {
            console.error(error)
            return new Promise((resolve) => {
               resolve(false)
            })
         });
   }


}