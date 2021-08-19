import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';

import userAuth from "@/app_class/userAuth";
import userNotebooks from "@/app_class/userNotebooks";
import Quiz from "@/app_class/quiz";

export default class User {
   /* 
   para access by UI:
      this.auth.user.displayName
      this.auth.user.photoURL

      this.notebook_info
      this.notebooks.noteBooks
      this.notebooks.noteBook_detail

      this.notebooks.currNotebook.notebook_name
      this.notebooks.currNotebook.languages
      this.notebooks.currNotebook.languages_details
      this.notebooks.currNotebook.word_list
   
   methods access by UI:
      this.auth.register()
      this.auth.login()
      this.auth.logout()

      this.notebooks.create_notebook()
      this.notebooks.switch_notebook()
      this.notebooks.update_notebook()
      this.notebooks.del_notebook()

      this.notebooks.currNotebook.add_record()
      this.notebooks.currNotebook.get_word()
      this.notebooks.currNotebook.update_record()
      this.notebooks.currNotebook.del_record()
      this.notebooks.currNotebook.export_notebook()

   */
   constructor() {
      this.auth = new userAuth()
      // ref: this.auth.db.doc(this.user.uid)
      // infor: this.auth.user.displayName, photoURL

      this.notebooks = new userNotebooks(this.auth.user_ref)

      this.quiz = new Quiz()

      // note: if defined in higher level, then this is not necessary
      // firebase.auth().onAuthStateChanged(() => {
      //    this.notebooks.update(this.auth.user_ref)
      //       .then(() => {
      //          this.quiz.user_ref = this.auth.user_ref
      //          this.notebook_info = this.get_noteBooks()
      //          // console.log(this)
      //       })
      // })
   }

   async init_user_db() {
      // user: firebase.auth().currentUser
      const {
         serverTimestamp
      } = firebase.firestore.FieldValue;

      return this.auth.db.doc(this.auth.user.uid).set({
            uid: this.auth.user.uid,
            username: this.auth.user.displayName,
            noteBooks: [],
            // last_opened_notebook: "",
            createdAt: serverTimestamp(),
         }).then(() => {
            console.log("User collection successfully written!");
            return Promise.resolve()
         })
         .catch((error) => {
            console.error("Error creating user database:", error);
            return Promise.reject(error);
         });
   }

   isLogin() {
      return this.auth.user == null ? false : true
   }

   userName() {
      return this.auth.user == null ? null : this.auth.user.displayName
   }

   userPhoto() {
      return this.auth.user == null ? null : this.auth.user.photoURL
   }

   get_noteBooks(notebook_id = null) {
      if (this.notebooks.user_ref == null) return null
      if (notebook_id == null) {
         return this.notebooks.noteBooks.map(id => {
            return {
               id: id,
               notebook_name: this.notebooks.noteBook_detail[id].notebook_name,
               languages: this.notebooks.noteBook_detail[id].languages,
            }
         })
      } else {
         return {
            id: notebook_id,
            notebook_name: this.notebooks.noteBook_detail[notebook_id].notebook_name,
            languages: this.notebooks.noteBook_detail[notebook_id].languages,
         }
      }
   }

   async init_quiz(notebook_id, config) {
      await this.notebooks.switch_notebook(notebook_id),
         await this.quiz.init(this.notebooks.currNotebook, config)
      return Promise.resolve()
   }

}