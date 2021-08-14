import firebase from "firebase/app";
import "firebase/auth";

import User from "@/app_class/user";

import WordList from "@/app_class/word_list";

import _ from "underscore"
import utilities from "./utilities";



export default class Test {
   constructor() {
      this.user = new User()

   }

   test_current_user() {
      console.log("test_current_user:", firebase.auth().currentUser)
   }

   test_invitation_code(code) {
      this.user.check_invitation(code)
         .then(res => {
            console.log("test_invitation_code:", code, "=>", res)
         })
   }

   test_register(user) {
      this.user.register(user).then(
         (res) => {
            console.log("test_register:", res, firebase.auth().currentUser)
         }
      )
   }

   async test_login(user) {
      let res = await this.user.login(user)
         .catch(error => console.log(11, error))
      console.log("test_login:", res, firebase.auth().currentUser)
   }

   test_logout() {
      this.user.logout()
   }


   // ------------------------------------------------------
   word_list_lan(ref, lan) {
      ref = firebase.firestore().collection("test_word_list")
      this.word_list = new WordList(ref, lan)
      console.log("word list:", this.word_list.languages)
   }

   async add_record(record) {
      await this.word_list.new_record(record)
      await this.word_list.get_list()
      // console.log("word list:", this.word_list.word_list)
   }

   async get_list() {
      await this.word_list.get_list()
      console.log("word list:", this.word_list.word_list)
   }

   set_props(id, prop) {
      this.word_list.set_record_prop(id, prop)
   }

   async test_init_user() {
      // if (firebase.auth().currentUser != null) {
      //    await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).delete()
      //    await firebase.auth().currentUser.delete()
      //    await firebase.auth.signOut()
      // }
      await this.user.logout()

      let new_user = {
         email: "test@gmail.com",
         pwd: "123456",
         username: "test",
         RegisterType: "email",
         loginType: "email",
      }

      // let new_user2 = {
      //    email: "",
      //    pwd: "",
      //    username: "",
      //    RegisterType: "google",
      //    loginType: "google",
      // }

      this.user = new User()
      let isTrue = await this.user.check_invitation("198812180")
      if (isTrue) {
         await this.user.register(new_user)
         await this.user.logout()
      }
      await this.user.login(new_user)
      console.log(firebase.auth().currentUser)

      // await this.user.create_notebook("n1", ["English", "Japanese", "Chinese (Simplified)"])
      // await this.user.create_notebook("n2", ["Japanese", "English"])
      console.log(this.user.currNotebook)

      let r1 = {
         en: "apple",
         zh: "苹果"
      }
      let r2 = {
         en: "apple",
         ja: "林檎"
      }
      let r3 = {
         en: "potato",
         ja: "じゃがいも",
         zh: "土豆"
      }

      // await this.user.switch_notebook("n1")
      await this.user.currNotebook.add_record(r1)
      await this.user.currNotebook.add_record(r2)
      await this.user.currNotebook.add_record(r3)

      let w1 = _.find(this.user.currNotebook.word_list, (w) => {
         return w.en == "apple"
      })

      let w2 = _.find(this.user.currNotebook.word_list, (w) => {
         return w.en == "potato"
      })

      // await this.user.currNotebook.del_record(w.id)

      await this.user.currNotebook.set_prop(w1.id, {
         mastered: true
      })

      await this.user.currNotebook.del_record(w2.id)
      await this.user.currNotebook.update_language(["Japanese"])

      _.each(this.user.currNotebook.word_list, (w) => {
         console.log(w.en, w.id, w.mastered, w.notes)
      })


      // await this.user.del_notebook("n1")


   }

   async test_file(file) {

      if (file == null) return

      let words = await utilities.upload_csv(file)

      console.log(words)

      await this.user.logout()

      let new_user = {
         email: "test@gmail.com",
         pwd: "123456",
         username: "test",
         RegisterType: "email",
         loginType: "email",
      }

      this.user = new User()
      await this.user.login(new_user)

      // await this.user.currNotebook.update_language(["English", "Japanese", "Chinese (Simplified)", "French"])

      // for (const w of words) {
      //    await this.user.currNotebook.add_record(w)
      // }

      _.each(this.user.currNotebook.word_list, (w) => {
         console.log(w.en, w.id, w.mastered, w.notes)
      })

      this.user.currNotebook.export_notebook()
   }


   async test_quiz() {

      await this.user.logout()

      let new_user = {
         email: "test@gmail.com",
         pwd: "123456",
         username: "test",
         RegisterType: "email",
         loginType: "email",
      }

      this.user = new User()
      await this.user.login(new_user)

      // quiz 1: 
      let quiz = {
         question_type: "spell", // voice, word, spell
         question_num: 10,
         // choice_num: 1,
         question_lan: "ja",
         // choice_lan: "en",
      }
      await this.user.currNotebook.new_quiz(quiz)
      await this.user.currNotebook.quiz.log_quiz()

   }
}