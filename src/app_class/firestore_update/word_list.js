let NoteBooks = {
   createdAt: "timestamp",
   lastUpdate: "timestamp",
   languages: "array",
   notebook_name: "string",
   word_list: {
      createdAt: "timestamp",
      last_learned: "timestamp",
      notes: "",
      favorite: false,
      mastered: false,
      score: 0,
      quiz_res: [],
      error: "DELETE",
      learned: "DELETE",
      last_tested: "DELETE",
      undefined: "DELETE",
      goal: "DELETE",
   }

}

let userDB_structure = {
   uid: "string",
   username: "string",
   noteBooks: "array",
   NoteBooks: NoteBooks,
   createdAt: "timestamp",
   
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
}

export default userDB_structure