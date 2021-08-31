import firebase from "firebase/app";

export default class Structure {
   constructor(db_structure) {
      this.structure = db_structure
      this.progressing = false
   }

   auth(userAuth) {
      this.auth = userAuth
      this.user_ref = userAuth.user_ref
   }

   async update_structure(structure = null, ref = null) {
      if (structure == null) {
         structure = this.structure
         ref = this.auth.user_ref
      }
      this.progressing = true
      const FieldValue = firebase.firestore.FieldValue;
      try {
         let keys = Object.keys(structure)
         for (var i = 0; i < keys.length; i++) {
            if (typeof structure[keys[i]] === 'object') {
               // if this is a collection
               let hasCollection = await this.hasCollection(keys[i], ref)
               if (hasCollection) {
                  // if the collection exists
                  let docs = await ref.collection(keys[i]).get()
                  docs = docs.docs
                  for (var j = 0; j < docs.length; j++) {
                     let collection_ref = ref.collection(keys[i]).doc(docs[j].id)
                     this.update_structure(structure[keys[i]], collection_ref)
                  }
               }
               // if the collection does not exists, do nothing
            } else {
               // if this is a field
               
               if (structure[keys[i]] !== "DELETE") {
                  let hasField = await this.hasField(keys[i], ref)
                  // add ned field
                  if (!hasField) {
                     let newVal = {}
                     newVal[keys[i]] = structure[keys[i]]
                     this.updateField(newVal, ref)
                  }
               } else {
                  // delete field
                  let newVal = {}
                  newVal[keys[i]] = FieldValue.delete()
                  this.updateField(newVal, ref)
               }
            }
         }
         this.progressing = false
         return Promise.resolve()
      } catch (error) {
         console.error(error);
         return Promise.reject(error);
      }

   }

   async hasField(key, ref = null) {
      if (ref == null) {
         ref = this.auth.user_ref
      }
      try {
         let res = await ref.get()
         return Promise.resolve(res.data()[key] !== undefined)
      } catch (error) {
         console.error(error);
         return Promise.reject(error);
      }
   }


   async hasCollection(key, ref = null) {
      if (ref == null) {
         ref = this.auth.user_ref
      }
      try {
         let res = await ref.collection(key).get()
         return Promise.resolve(!res.empty)
      } catch (error) {
         console.error(error);
         return Promise.reject(error);
      }
   }

   async updateField(newfield, ref = null) {
      if (ref == null) {
         ref = this.auth.user_ref
      }
      try {
         await ref.update(newfield)
         console.log(newfield, "updated")
         return Promise.resolve()
      } catch (error) {
         console.error(error);
         return Promise.reject(error);
      }
   }

   async check_db_version(version) {
      try {
         let ref = this.auth.user_ref
         let res = await ref.get()

         return Promise.resolve(res.data()["databaseVersion"] == version)
      } catch (error) {
         console.error(error);
         return Promise.reject(error);
      }
   }

}