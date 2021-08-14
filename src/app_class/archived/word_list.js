import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';

import world_language from "@/app_class/languages"
import _ from "underscore"



export default class WordList {
   constructor(ref, languages) {
      this.ref = ref
      this.languages = _.map(languages, (en) => {
         return world_language.world_language[en].key
      })
      
      this.ref.get()
         .then(res => {
            if (!res.empty) {
               this.get_list()
            }
         })
   }

   async get_list() {
      // will return a object array of word_list to local
      this.word_list = []
      return this.ref.get()
         .then(res => {
            res.forEach((doc) => {
               // doc.data() is never undefined for query doc snapshots
               let record = doc.data()
               record.id = doc.id
               this.word_list.push(record)
            });
         })
   }


   async new_record(record) {
      // note: make sure update one record at one time
      const {
         serverTimestamp
      } = firebase.firestore.FieldValue;

      let word = {
         favorite: false,
         mastered: false,
         learned: 0,
         error: 0,
         notes: "",
         last_tested: null,
         last_learned: serverTimestamp(),
         createdAt: serverTimestamp()
      }

      _.map(Object.keys(record), (key) => {
         if (_.contains(this.languages, key)) {
            word[key] = record[key]
         }
      })

      // note: this will check if the new word have same word in any languages
      let duplicated = _.filter(this.word_list, (x) => {
         let p = false
         _.each(this.languages, (key) => {
            p = p || (x[key] == word[key])
         })
         return p
      })

      if (duplicated.length == 0) {
         // if it is not a duplicated word
         console.log("new word added...")
         return this.ref.add(word)
      } else {
         // if the word is a duplicated word, only update the given attrs.
         console.log("existing word updated...")
         return this.ref.doc(duplicated[0].id).update(record)
      }
   }

   set_record_prop(id, prop) {
      return this.ref.doc(id).update(prop)
   }


   
}
