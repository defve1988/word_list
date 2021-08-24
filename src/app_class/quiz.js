/*
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
   //    question_lan: "ja",
   //    choice_lan: "en",
   // }

   // 3. spell
   // quiz = {
   //    question_type: "spell", // voice, word, spell
   //    question_num: 10,
   //    question_lan: "ja",
   // }

*/
import firebase from "firebase/app";

import _ from "underscore"

export default class Quiz {
   constructor() {
      this.notebook_id = ""
      this.config = {
         question_num: 20,
         choice_num: 4,
         question_lan: "en",
         choice_lan: "zh",
         // TODO:
         range: "all", //all, favorite, mastered, not mastered
      }

      // {
      //    answer:,
      //    answer_aduio:,
      //    choice:
      //    correct:
      //    isCorrect:
      // }
      this.quiz_list = []
   }

   async init(notebook, config = null) {
      // console.log(config)
      this.notebook = notebook
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
         switch (this.config.range) {
            case "necessary":
               notebook.sort("learned")
               notebook.sort("error rate")
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

         if (selecting.length < this.config.question_num) {
            alert("No enough words!")
            return Promise.resolve(false)
         }

         let questions = _.sample(selecting, this.config.question_num)

         _.each(questions, (q) => {
            let id = q.id
            // correct answer
            let question = q[this.config.question_lan]

            let choice = null
            // wrong choices
            let choice_set = _.filter(notebook.word_list, w => {
               return w.id != id
            })
            choice = _.sample(choice_set, this.config.choice_num - 1)
            choice = _.map(choice, (c) => {
               return {
                  text: c[this.config.choice_lan],
                  correct: false
               }
            })
            // correct choice
            choice.push({
               text: q[this.config.choice_lan],
               correct: true,
               isCorrect: null
            })

            choice = _.shuffle(choice)

            this.quiz_list.push({
               question: question,
               correct: null,
               correct_answer: q[this.config.choice_lan],
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

   async summary() {
      try {
         const {
            serverTimestamp
         } = firebase.firestore.FieldValue;
         for (var i = 0; i < this.quiz_list.length; i++) {
            let q = this.quiz_list[i]
            let word = this.notebook.get_word(q.id)
            let prop = {
               learned: word.learned + 1,
               error: word.error,
               last_learned: serverTimestamp(),
            }
            if (!q.correct) {
               prop.error += 1
            }
            await this.notebook.update_record(q.id, prop)
         }
         return Promise.resolve()
      } catch (error) {
         console.error("Error when summary quiz:", error);
         return Promise.reject(error)
      }
   }



}