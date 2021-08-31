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
            createdAt: serverTimestamp(),

            databaseVersion: "v0.1",
            notebook_view: "card",
            
            theme_dark: false,
            theme_brightness: 10,
            theme_app_bg: 15 / 2.55,
            theme_nav_bar_bg: 25 / 2.55,
            theme_content_color: 180 / 2.55,
            theme_card_bg: 45 / 2.55,
            
            quiz_notebook_id: null,
            quiz_notebook_name: null,
            quiz_quiz_type: null,
            quiz_play_audio: true,
            quiz_question_num: 20,
            quiz_choice_num: 4,
            quiz_question_lan: null,
            quiz_choice_lan: null,
            quiz_range: "necessary",
            quiz_excellent_response: 1.5,
         
            learning_goal: 20,
            learning_excellent_scores: 5,
            learning_nice_scores: 3,
            learning_ok_scores: 2,
            learning_correct_score: 1,
            learning_error_score: -2.5,
            learning_excellent_chain_award:3, // get additional excellent score
            learning_nice_chain_award:3, //get additional nice score
            //time multiplier will effected after 3 days
            // multiplier work as score*(1+log(days))
            learning_time_award_effected: 3, 

         }).then(() => {
            console.log("User collection successfully written!");
            return Promise.resolve()
         })
         .catch((error) => {
            console.error("Error creating user database:", error);
            return Promise.reject(error);
         });
   }

   async get_detail(key) {
      try {
         let res = await this.auth.db.doc(this.auth.user.uid).get()
         res = res.data()
         return Promise.resolve(res[key])
      } catch (error) {
         console.error(error);
         return Promise.reject(error);
      }
   }

   async set_detail(vals) {
      try {
         await this.auth.db.doc(this.auth.user.uid).update(vals)
         return Promise.resolve()
      } catch (error) {
         console.error(error);
         return Promise.reject(error);
      }
   }

   async get_user_quiz_config() {
      try {
         let user_data = await this.auth.db.doc(this.auth.user.uid).get()
         user_data = user_data.data()
         this.quiz_config = {
            notebook_id: user_data.quiz_notebook_id,
            notebook_name: user_data.quiz_notebook_name,
            quiz_type: user_data.quiz_quiz_type,
            play_audio: user_data.quiz_play_audio,
            config: {
               question_num: user_data.quiz_question_num,
               choice_num: user_data.quiz_choice_num,
               question_lan: user_data.quiz_question_lan,
               choice_lan: user_data.quiz_choice_lan,
               range: user_data.quiz_range,
               excellent_response: user_data.quiz_excellent_response,
            }
         }
         return Promise.resolve(this.quiz_config)
      } catch (error) {
         console.error(error);
         return Promise.reject(error);
      }
   }

   async set_user_quiz_config(quiz_dialog) {
      try {
         let user_quiz_config = {
            quiz_notebook_name: quiz_dialog.notebook_name,
            quiz_notebook_id: quiz_dialog.notebook_id,
            quiz_quiz_type: quiz_dialog.quiz_type,
            quiz_play_audio: quiz_dialog.play_audio,

            quiz_question_num: quiz_dialog.config.question_num,
            quiz_choice_num: quiz_dialog.config.choice_num,
            quiz_question_lan: quiz_dialog.config.question_lan,
            quiz_choice_lan: quiz_dialog.config.choice_lan,
            quiz_range: quiz_dialog.config.range,
            quiz_excellent_response: quiz_dialog.config.excellent_response,
         }
         await this.auth.db.doc(this.auth.user.uid).update(user_quiz_config)
         return Promise.resolve()
      } catch (error) {
         console.error(error);
         return Promise.reject(error);
      }
   }


   async get_user_learning() {
      try {
         let user_data = await this.auth.db.doc(this.auth.user.uid).get()
         user_data = user_data.data()
         this.learning = {
            learning_goal: user_data.learning_goal,
            learning_excellent_scores: user_data.learning_excellent_scores,
            learning_nice_scores: user_data.learning_nice_scores,
            learning_ok_scores: user_data.learning_ok_scores,
            learning_correct_score: user_data.learning_correct_score,
            learning_error_score: user_data.learning_error_score,
            learning_excellent_chain_award: user_data.learning_excellent_chain_award,
            learning_nice_chain_award: user_data.learning_nice_chain_award,
            learning_time_award_effected: user_data.learning_time_award_effected,
         }
         return Promise.resolve(this.learning)
      } catch (error) {
         console.error(error);
         return Promise.reject(error);
      }
   }

   async get_user_theme() {
      try {
         let user_data = await this.auth.db.doc(this.auth.user.uid).get()
         user_data = user_data.data()
         this.theme = {
            dark: user_data.theme_dark,
            brightness: user_data.theme_brightness,
            app_bg: user_data.theme_app_bg,
            nav_bar_bg: user_data.theme_nav_bar_bg,
            content_color: user_data.theme_content_color,
            card_bg: user_data.theme_card_bg,
         }
         return Promise.resolve(this.theme)
      } catch (error) {
         console.error(error);
         return Promise.reject(error);
      }
   }

   async set_user_theme(theme) {
      try {
         let user_theme = {
            theme_dark: theme.dark,
            theme_brightness: theme.brightness,
            theme_app_bg: theme.app_bg,
            theme_nav_bar_bg: theme.nav_bar_bg,
            theme_content_color: theme.content_color,
            theme_card_bg: theme.card_bg,
         }
         await this.auth.db.doc(this.auth.user.uid).update(user_theme)
         return Promise.resolve()
      } catch (error) {
         console.error(error);
         return Promise.reject(error);
      }
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

   // async theme(){
   //    let res = await this.auth.user_ref.collection("theme").get()
   //    // if (res.data().theme==undefined){

   //    // }
   //    return res
   // }

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
      await this.notebooks.switch_notebook(notebook_id)
      // console.log(config)
      return await this.quiz.init(this.notebooks.currNotebook, config)
   }

}