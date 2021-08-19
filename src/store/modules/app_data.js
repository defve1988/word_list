import world_language from "@/app_class/languages"
import User from "@/app_class/user";
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

const state = {

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
      notebook_id: "",
      quiz_type: "",
      play_audio_1: false,
      play_audio_2: true,
      config: {
         question_num: 20,
         choice_num: 4,
         question_lan: "en",
         choice_lan: "zh",
         // TODO:
         range: "necessary", //necessary, all, favorite, mastered, not mastered
      }
   },
   quiz_res_dialog: {
      show: false
   }



};

const getters = {

};

const actions = {};

const mutations = {

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