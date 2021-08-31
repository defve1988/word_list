import firebase from "firebase/app";

import world_language from "@/app_class/languages"
import _ from "underscore"


// usage
// let audio = new Audio('url')
// await utilities.playAudio(audio);

function playAudio(audio) {
   return new Promise(res => {
      audio.play()
      audio.onended = res
   })
}

function wait(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

function key2display(key) {
   let en = world_language.key_en[key]
   return world_language.world_language[en].display

}

function en2display(languages) {
   // note: utf-8 space is "\xa0"
   return _.map(languages, (lan) => {
      return world_language.world_language[lan].display
   })
}

function display2key(languages) {
   // note: utf-8 space is "\xa0"
   return _.map(languages, (lan) => {
      let matched = _.find(world_language.world_language, (w) => {
         return w.display.toLowerCase() == lan.toLowerCase().replace("\xa0", " ")
      })
      if (matched != undefined) {
         return matched.key
      }
   })
}

function lan2key(languages) {
   // note: utf-8 space is "\xa0"
   return _.map(languages, (lan) => {
      let matched = _.find(world_language.world_language, (w) => {
         return w.display.toLowerCase() == lan.toLowerCase().replace("\xa0", " ")
      })
      if (matched != undefined) {
         return matched.key
      }
   })
}

async function deleteCollection(collectionPath, batchSize) {
   let db = firebase.firestore()
   const collectionRef = db.collection(collectionPath);
   const query = collectionRef.orderBy('__name__').limit(batchSize);

   return new Promise((resolve, reject) => {
      deleteQueryBatch(db, query, resolve).catch(reject);
   });
}

async function deleteQueryBatch(db, query, resolve) {
   const snapshot = await query.get();

   const batchSize = snapshot.size;
   if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve();
      return;
   }

   // Delete documents in a batch
   const batch = db.batch();
   snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
   });
   await batch.commit();

   // Recurse on the next process tick, to avoid
   // exploding the stack.
   process.nextTick(() => {
      deleteQueryBatch(db, query, resolve);
   });
}


// ----------------------------------------------------------------------------

// upload and download files
async function upload_csv(file) {
   // only support csv utf-8 format
   try {
      let response = await readFileAsync(file);
      let content = await convert_csv(response);
      return Promise.resolve(content)
   } catch (error) {
      console.error("Error when uploading file:", error);
      return Promise.reject(error)
   }
}

async function readFileAsync(file) {
   return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
         resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsText(file, "utf-8");
   })
}

async function convert_csv(data) {
   try {
      let lines = data.split("\n")
      let output = []
      let header = lines[0].trim().split(",").filter((x) => {
         return x.trim().length > 0
      })
      console.log(header)
      header = header.map(x => x.toLowerCase().trim())
      header = lan2key(header)
      console.log(header)
      for (let l = 1; l < lines.length; l++) {
         let content = lines[l].split(",").filter((x) => {
            return x.trim().length > 0
         })
         if (content.length == header.length) {
            let line = {}
            for (const h in header) {
               line[header[h]] = content[h].trim()
            }
            output.push(line)
         }
      }
      return Promise.resolve(output)
   } catch (error) {
      console.error("Error when reading csv file content:", error);
      return Promise.reject(error)
   }
}

// ----------------------------------------------------------------------------

function handle_redundant_route(err) {
   // Ignore the vuex err regarding  navigating to the page they are already on.
   if (
      err.name !== "NavigationDuplicated" &&
      !err.message.includes(
         "Avoided redundant navigation to current location"
      )
   ) {
      // But print any other errors to the console
      console.error(err);
   }
}



export default {
   playAudio,
   wait,
   key2display,
   en2display,
   display2key,
   lan2key,
   deleteCollection,
   upload_csv,
   handle_redundant_route
}