import world_language from "@/app_class/languages"
import User from "@/app_class/user";

import firestore_update from "@/app_class/firestore_update"


// import Test from "@/app_class/test";

import firebase from "firebase/app";
// import "firebase/auth";
// import 'firebase/firestore';

var newUser = new User()

firebase.auth().onAuthStateChanged(() => {
   state.user.notebooks.update(state.user.auth.user_ref)
      .then(() => {
         state.user.quiz.user_ref = state.user.auth.user_ref
         state.user.notebook_info = state.user.get_noteBooks()
         state.notebook_info = newUser.notebook_info
      })
   // console.log(state)
})

const theme_default = {
   dark: false,
   brightness: 90,
   app_bg: 15 / 2.55,
   nav_bar_bg: 25 / 2.55,
   content_color: 180 / 2.55,
   card_bg: 45 / 2.55,

   text_font_size: null,
   text_font_wight: null,
   text_font: null,
}

const state = {
   firestore_db: firestore_update,
   db_version: "v0.1",
   theme: theme_default,
   // login_page : "Notebooks",
   login_page: "NoteBooks",

   theme_color: {},

   notebook_view: "card",

   dev_test: true,
   // test: new Test(),

   wordnik_key: "a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
   user: newUser,
   world_language: world_language.world_language,

   isloading: false,

   // this controls the entering animation of each row
   word_table_view: "list",

   card_front: null,
   card_back: null,

   word_list_loaded: false,
   word_list_leave: false,
   word_grid_loaded: false,

   register_dialog: false,
   mini_drawer: true,

   select_language_dialog: false,
   select_language: [],

   notebook_info: null,

   new_notebook: false, // whether the dialog create a new notebook
   update_language_notebook: "", // update which notebook

   show_word_list_notes: true,

   content_menu: {
      show: false,
      x: 0,
      y: 0,
      target: {
         id: null
      }
   },

   notes_dialog: {
      show: false,
      id: null,
      language: null,
      word: null,
      notes: null
   },



   quiz_dialog: {
      show: false,
      created: false,
      notebook_name: "",
      notebook_id: "",
      quiz_type: "Word-Word",
      play_audio: true,
      config: {
         question_num: 20,
         choice_num: 4,
         question_lan: "",
         choice_lan: "",
         // TODO:
         range: "Necessary", //necessary, all, favorite, mastered, not mastered,
         excellent_response: 1.5
      }
   },
   quiz_res_dialog: {
      show: false
   },

   learning: {
      learning_goal: 20,
      learning_excellent_scores: 5,
      learning_nice_scores: 3,
      learning_ok_scores: 2,
      learning_correct_score: 1,
      learning_error_score: -2.5,
      learning_excellent_chain_award: 3, // get additional excellent score
      learning_nice_chain_award: 3, //get additional nice score
      //time multiplier will effected after 3 days
      // multiplier work as score*(1+log(days))
      learning_time_award_effected: 3,
   }

};

const getters = {

};

const actions = {

   async UPDATE_DB({
      state
   }) {
      state.firestore_db.auth(state.user.auth)
      state.firestore_db.update_structure()
   },

   async CHECK_DB({
      state
   }) {
      state.firestore_db.auth(state.user.auth)
      let res = await state.firestore_db.isField("databaseVersion")
      if (!res) {
         state.firestore_db.addField({
            "databaseVersion": state.db_version
         })
         alert("Please update database!")
      } else {
         let version = await state.firestore_db.check_db_version(state.db_version)
         if (!version) {
            alert("Please update database!")
         } else {
            alert("Database is up-to-date.")
         }
      }
   }
};

const mutations = {

   SET_QUIZ_CONFIG(state, quiz_config) {
      Object.assign(
         state.quiz_dialog,
         quiz_config
      )
      // console.log(quiz_config)
      // console.log(state.quiz_dialog)
   },

   SET_LEARNING(state, learning) {
      Object.assign(
         state.learning,
         learning
      )
      console.log(learning)
      // console.log(state.quiz_dialog)
   },

   async SET_THEME(stat) {
      // let user_theme = await state.user.theme()
      // console.log(user_theme)
      // if (state.theme==null){
      //    state.theme = theme_default
      // }

      let brightness = stat.theme.brightness;
      let app_bg_color = stat.theme.app_bg * 2.55;
      let nav_bg_color = stat.theme.nav_bar_bg * 2.55;
      let card_bg_color = stat.theme.card_bg * 2.55;
      let content_color = stat.theme.content_color * 2.55;

      app_bg_color = app_bg_color + 2.55 * brightness;
      nav_bg_color = nav_bg_color + 2.55 * brightness;
      card_bg_color = card_bg_color + 2.55 * brightness;
      content_color = Math.abs(2.55 * brightness - content_color);
      // console.log(content_color)
      stat.theme_color = {
         app_bg: `rgba(${app_bg_color}, ${app_bg_color}, ${app_bg_color})`,
         nav_bg: `rgba(${nav_bg_color}, ${nav_bg_color}, ${nav_bg_color})`,
         card_bg: `rgba(${card_bg_color}, ${card_bg_color}, ${card_bg_color})`,
         content: `rgba(${content_color}, ${content_color}, ${content_color},1)`,
      };
   },
   LOAD_WORDLSIT(state) {
      state.user.word_list.get_word_list()
      state.user.word_list.word_list.forEach(element => {
         console.log(element)
      });
   },

   CONTENTMENU(state, e) {
      e.preventDefault();
      state.content_menu.show = false;
      state.content_menu.x = e.clientX;
      state.content_menu.y = e.clientY;
      state.content_menu.target = e.target;
   },

};

export default {
   state,
   getters,
   actions,
   mutations
};