/* 
old content
quiz configure dialog
1. select notebook
2. select quiz type, and languages
3. select question and option numbers

   // quiz 
   // 1. flash card: 
   // quiz = {
   //    question_type: // voice, word,
   //    question_num: 10,
   //    choice_num: 1,
   //    question_lan: "ja",
   //    choice_lan: "en",
   // }

   // 2. one to n choice
   // quiz = {
   //    question_type: "word", // voice, word
   //    question_num: 10,
   //    choice_num: 4,
   //    question_lan: "",
   //    choice_lan: "",
   // }

   // 3. spell
   // quiz = {
   //    question_type: "spell", // voice, word, spell
   //    question_num: 10,
   //    question_lan: "",
   // }
 old content
*/
import firebase from "firebase/app";

import _ from "underscore"
import utilities from "./utilities";

export default class Quiz {
   constructor() {
      this.notebook_id = ""
      this.response_score = {
         excellent: 5,
         nice: 3,
         ok: 2,
         correct: 1,
         error: -2.5,
         excellent_chain: 3,
         nice_chain: 3,
         time_effect: 3,
      }
      this.config = {
         question_num: 20,
         choice_num: 4,
         question_lan: "",
         choice_lan: "",
         // TODO:
         range: "all", //all, favorite, mastered, not mastered

         // excellent response: within 1s
         // nice: 1*2 ms
         // OK: 1*3 ms
         // correct: over 1*3 ms
         // try next time: wrong answer 
         excellent_response: 2

      }

      // {
      //    answer:,
      //    answer_aduio:,
      //    choice:
      //    correct:
      //    isCorrect:
      // }
      this.quiz_list = []
      this.score = {
         tested: 0,
         error: 0,
      }
   }

   async init(notebook, config = null) {
      // console.log(config)
      this.notebook = notebook
      this.score = {
         tested: 0,
         error: 0,
      }
      this.quiz_list = []
      try {
         // this.notebook_id = notebook_id
         if (config != null) {
            this.config = config
         }

         // let notebook_ref = this.user_ref.collection("NoteBooks").doc(notebook_id)
         // this.notebook = new NoteBook(notebook_ref)
         // await this.notebook.init()

         let selecting
         // todo: how to ranking words
         switch (this.config.range.toLowerCase()) {
            case "necessary":
               notebook.sort("score")
               // notebook.sort("last")
               // console.log(notebook.word_list)
               selecting = notebook.word_list.filter(w => {
                  return !w.mastered
               })
               selecting = selecting.slice(0, this.config.question_num + 1)
               break;
            case "all":
               selecting = notebook.word_list
               break;
            case "favorite":
               selecting = _.filter(notebook.word_list, w => {
                  return w.favorite
               })
               break;
            case "mastered":
               selecting = _.filter(notebook.word_list, w => {
                  return w.mastered
               })
               break;
            case "not mastered":
               selecting = _.filter(notebook.word_list, w => {
                  return !w.mastered
               })
               break;
         }
         // console.log(selecting)

         if (selecting.length < this.config.question_num || selecting.length < this.config.choice_num) {
            alert("No enough words!")
            return Promise.resolve(false)
         }

         let questions = _.sample(selecting, this.config.question_num)
         let question_lan = utilities.display2key([this.config.question_lan])[0]
         let choice_lan = utilities.display2key([this.config.choice_lan])[0]

         _.each(questions, (q) => {
            let id = q.id
            // correct answer
            let question = q[question_lan]

            let choice = null
            // wrong choices
            let choice_set = _.filter(notebook.word_list, w => {
               return w.id != id
            })
            choice = _.sample(choice_set, this.config.choice_num - 1)
            choice = _.map(choice, (c) => {
               return {
                  text: c[choice_lan],
                  correct: false
               }
            })
            // correct choice
            choice.push({
               text: q[choice_lan],
               correct: true,
               isCorrect: null
            })

            choice = _.shuffle(choice)

            this.quiz_list.push({
               question: question,
               correct: null,
               response: {
                  response: "",
                  quiz_type: ""
               },
               correct_answer: q[choice_lan],
               choice: choice,
               id: id
            })
         })

         // console.log(this.quiz_list)
         return Promise.resolve(true)
      } catch (error) {
         console.error("Error when creating quiz:", error);
         return Promise.reject(error);
      }


   }

   summary(response_scores = null) {
      if (response_scores !== null) {
         this.response_score = response_scores
      }
      const excellent_chain = this.response_score.excellent_chain
      const nice_chain = this.response_score.nice_chain

      for (var i = 0; i < this.quiz_list.length; i++) {
         let q = this.quiz_list[i]
         let word = this.notebook.get_word(q.id)

         // record at most five quiz results
         let quiz_res = word.quiz_res
         if (quiz_res == null) quiz_res = []
         quiz_res.push(q.response.response)
         if (quiz_res.length > 5) {
            quiz_res.shift()
         }

         let score = this.response_score[q.response.response]
         if (q.response.quiz_type == "Spell") {
            score *= 3
         }

         if (this.check_chain(quiz_res, "excellent", excellent_chain)) {
            score += this.response_score.excellent
         } else if (this.check_chain(quiz_res, "nice", nice_chain)) {
            score += this.response_score.nice
         } else if (this.check_chain(quiz_res, "error", nice_chain)) {
            score += this.response_score.error
         }

         if (word.last_learned != null) {
            let last_learned = word.last_learned.toDate().toDateString()
            let time_passed = new Date() - new Date(last_learned)
            time_passed = time_passed / 1000 / 3600 / 24
            if (time_passed >= this.response_score.time_effect) {
               score = score * (1 + Math.log10(time_passed))
            }
         }

         // console.log(score, quiz_res, word.en)

         this.quiz_list[i].uploads = {
            plus: score,
            score: word.score + score,
            quiz_res: quiz_res
         }
      }
      console.log(this.quiz_list)

   }

   async upload_res() {
      try {
         const {
            serverTimestamp
         } = firebase.firestore.FieldValue;
         for (var i = 0; i < this.quiz_list.length; i++) {
            let q = this.quiz_list[i]
            await this.notebook.update_record(q.id, {
               score: q.uploads.score,
               quiz_res: q.uploads.quiz_res,
               last_learned: serverTimestamp()
            })
         }
         return Promise.resolve()
      } catch (error) {
         console.error("Error when summary quiz:", error);
         return Promise.reject(error)
      }
   }


   check_chain(res, key, num) {
      if (res.length < num) return false
      let check = true
      for (var i = res.length - 1; i >= res.length - num; i--) {
         if (key == "nice") {
            if (res[i] != "nice" && res[i] != "excellent") check = false
         } else {
            if (res[i] != key) check = false
         }
      }
      return check
   }

}