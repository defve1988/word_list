import firebase from "firebase/app";
import world_language from "@/app_class/languages"

import _ from "underscore"

export default class NoteBook {
   constructor(ref) {
      this.notebook_ref = ref
      this.word_list_ref = ref.collection("word_list")

      this.notebook_name = null
      this.word_list = []

      // languages: english names
      this.languages = []

      // show_language
      // en: english names
      // key: key
      // display: name in the that language
      // show: bool
      this.languages_details = {}

   }

   async create(notebook_name, languages) {
      // create note book at first time
      // languages: array of en names
      try {
         const {
            serverTimestamp
         } = firebase.firestore.FieldValue;

         return await this.notebook_ref.set({
            notebook_name: notebook_name,
            languages: languages,
            createdAt: serverTimestamp(),
            lastUpdate: serverTimestamp(),
         })

      } catch (error) {
         console.error("Error when creating notebook:", error);
         return Promise.reject(error);
      }
   }


   async init() {
      // init note book when loading
      try {
         let data = await this.notebook_ref.get()

         this.notebook_name = data.data()["notebook_name"]
         this.languages = data.data()["languages"]

         this.languages.forEach(
            l => {
               this.languages_details[l] = {
                  en: l,
                  key: world_language.world_language[l].key,
                  display: world_language.world_language[l].display,
                  show: true
               }
            }
         )

         await this.get_word_list()
         return Promise.resolve()
      } catch (error) {
         console.error("Error when init notebook:", error);
         return Promise.reject(error);
      }
   }

   async get_word_list() {
      try {
         this.word_list = []
         await this.word_list_ref.get()
            .then((res) => {
               // console.log(res.empty)
               if (!res.empty) {
                  res.forEach((doc) => {
                     // doc.data() is never undefined for query doc snapshots
                     let record = doc.data()
                     record.id = doc.id
                     record.show = !record.mastered
                     this.word_list.push(record)
                  });
               }
            })

         this.sort("date", true)

         return Promise.resolve()
      } catch (error) {
         console.error("Error when getting word lists:", error);
         return Promise.reject(error);
      }
   }

   async check_duplicate_word(record) {
      try {
         // note: this will check if the new word have same word in any languages
         let lan_key = this.languages.map(l => this.languages_details[l].key)

         let duplicated = _.filter(this.word_list, (x) => {
            let p = false
            _.each(lan_key, (key) => {
               p = p || ((x[key] == record[key]) && x[key] != "")
            })
            return p
         })

         if (duplicated.length == 0) {
            return Promise.resolve(null)
         } else {
            return Promise.resolve(duplicated[0].id)
         }
      } catch (error) {
         console.error("Error when checking duplicate words:", error);
         return Promise.reject(error)
      }
   }

   async add_record(record) {
      // console.log(record);

      // note: make sure update one record at one time
      try {
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

         let lan_key = this.languages.map(l => this.languages_details[l].key)

         _.map(lan_key, (key) => {
            // note: firestore not support undefined
            if (record[key] == undefined) {
               word[key] = ""
            } else {
               word[key] = record[key]
            }
         })

         // update local
         let docRef = await this.word_list_ref.add(word)
         console.log("new word added ", docRef.id)
         word.id = docRef.id
         word.show = true
         this.word_list.unshift(word)

         return Promise.resolve()
      } catch (error) {
         console.error("Error when adding new record:", error);
         return Promise.reject(error);
      }
   }

   async del_record(id) {
      try {
         await this.word_list_ref.doc(id).delete()
         // update local
         this.word_list = _.filter(this.word_list, word => {
            return word.id != id
         })

         console.log("Record deleted.")
         return Promise.resolve()
      } catch (error) {
         console.error("Error when deleting record:", error);
         return Promise.reject(error);
      }
   }

   async update_record(id, prop) {
      try {
         this.word_list_ref.doc(id).update(prop)

         for (var i = 0; i < this.word_list.length; i++) {
            if (this.word_list[i].id == id) {
               Object.assign(this.word_list[i], prop)
            }
         }

         console.log("Record updated.")
         return Promise.resolve()
      } catch (error) {
         console.error("Error when updating record:", error);
         return Promise.reject(error);
      }
   }

   async export_notebook() {
      try {

         let csvContent = "data:text/csv;charset=utf-8,";
         let row_header = this.languages.map(l => this.languages_details[l].display)
         let row_header_key = this.languages.map(l => this.languages_details[l].key)

         row_header = row_header.concat(["favorite", "mastered", "learned", "error", "note"])
         row_header_key = row_header_key.concat(["favorite", "mastered", "learned", "error", "note"])

         // console.log(row_header)

         csvContent += row_header.join(",") + "\r\n";

         this.word_list.forEach((word) => {
            let row = _.map(row_header_key, (key) => {
               return word[key]
            })
            csvContent += row.join(",") + "\r\n";
         });
         // console.log(csvContent)

         var encodedUri = encodeURI(csvContent);
         var link = document.createElement("a");
         link.setAttribute("href", encodedUri);
         link.setAttribute("download", `${this.notebook_name}.csv`);
         document.body.appendChild(link);

         link.click();

      } catch (error) {
         console.error("Error when exporting notebook:", error);
         return Promise.reject(error)
      }
   }

   sort(sort_type, ascending) {
      switch (sort_type) {
         case "random":
            this.word_list = _.shuffle(this.word_list);
            break;
         case "date":
            this.word_list = _.sortBy(this.word_list, 'createdAt')
            break;
         case "error rate":
            this.word_list = _.sortBy(this.word_list, 'error')
            break;
         case "type":
            this.word_list = _.sortBy(this.word_list, 'mastered')
            this.word_list = _.sortBy(this.word_list, 'favorite')
            break;
      }
      if (ascending) this.word_list.reverse()
   }

   filter(filters) {
      this.word_list = _.each(this.word_list, word => {
         let p = true
         p = filters.favorite ? p && word.favorite : p
         p = filters.mastered ? p && word.mastered : p && !word.mastered
         word.show = p
      })
   }

   get_word(id) {
      return _.filter(this.word_list, w => {
         return w.id == id
      })[0]
   }
}