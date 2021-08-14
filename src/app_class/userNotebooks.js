import NoteBook from "@/app_class/note_book";
import utilities from "@/app_class/utilities";
import _ from "underscore"


export default class userNotebooks {
   constructor(user_ref) {
      this.user_ref = user_ref
      this.noteBooks = []
      this.noteBook_detail = {}
      this.currNotebook = null
      if (this.user_ref != null) {
         this.update(this.user_ref)
      }
   }

   async update(user_ref) {
      try {
         if (user_ref != null) {
            let user_data = await user_ref.get()
            if (user_data.data() != null) {
               this.noteBooks = user_data.data()["noteBooks"]
               for (var i = 0; i < this.noteBooks.length; i++) {
                  let ref = user_ref.collection("NoteBooks").doc(this.noteBooks[i])
                  let data = await ref.get()

                  let languages = data.data()["languages"]
                  let notebook_name = data.data()["notebook_name"]

                  this.noteBook_detail[this.noteBooks[i]] = {
                     languages: languages,
                     notebook_name: notebook_name
                  }
               }
            }
            this.user_ref = user_ref
            return Promise.resolve()
         }
      } catch (error) {
         console.error("Error when get notebook details:", error);
         return Promise.reject(error)
      }

   }

   async create_notebook(notebook_name, languages) {
      try {
         let notebook_id = new Date().getTime().toString()
         let notebook_ref = this.user_ref.collection("NoteBooks").doc(notebook_id)

         let new_notebook = new NoteBook(notebook_ref)
         await new_notebook.create(notebook_name, languages)
         await new_notebook.init()

         this.noteBooks.push(notebook_id)
         this.noteBook_detail[notebook_id] = {
            notebook_name: notebook_name,
            languages: languages
         }

         this.user_ref.update({
            "noteBooks": this.noteBooks
         })

         console.log(`Notebook ${notebook_name} added.`)
         return Promise.resolve()
      } catch (error) {
         console.error("Error when creating notebook:", error);
         return Promise.reject(error);
      }
   }

   async switch_notebook(notebook_id) {
      try {
         let notebook_ref = this.user_ref.collection("NoteBooks").doc(notebook_id)
         this.currNotebook = new NoteBook(notebook_ref)
         await this.currNotebook.init()

         console.log(`Switch to notebook ${this.currNotebook.notebook_name}.`)
         return Promise.resolve()
      } catch (error) {
         console.error("Error when switching notebook:", error);
         return Promise.reject(error);
      }
   }

   async update_notebook(notebook_id, props) {
      try {
         // get notebook ref and update values
         let notebook_ref = this.user_ref.collection("NoteBooks").doc(notebook_id)
         await notebook_ref.update(props)
         Object.assign(
            this.noteBook_detail[notebook_id],
            props
         )
         return Promise.resolve()
      } catch (error) {
         console.error("Error when updating notebook:", error);
         return Promise.reject(error)
      }
   }


   async del_notebook(notebook_id) {
      // note: Warning: Deleting a document does not delete its subcollections!
      try {
         // del notebook from local
         // console.log(notebook_id)

         this.noteBooks = _.filter(this.noteBooks, n => n != notebook_id);
         delete this.noteBook_detail[notebook_id];

         // console.log(this.noteBooks)

         // update firestore
         this.user_ref.update({
            "noteBooks": this.noteBooks
         })

         // first delete sub collection word_list
         // then delete notebook
         let notebook_ref = this.user_ref.collection("NoteBooks").doc(notebook_id)
         let word_list_ref = notebook_ref.collection("word_list")

         await utilities.deleteCollection(word_list_ref.path, 100)
         await notebook_ref.delete()

         console.log(`Notebook ${notebook_id} deleted.`)
         return Promise.resolve()
      } catch (error) {
         console.error("Error when deleting notebook:", error);
         return Promise.reject(error);
      }
   }

}