<template>
  <v-container class="pa-5">
    <v-row>
      <template v-for="(word, index) in welcome_word">
        <v-col :key="index" md="6" lg="4">
          <FlashCard :word="word" />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>


<script>
import { mapState, mapMutations } from "vuex";
import _ from "underscore";

export default {
  name: "Home",
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
  },
  data: () => ({
    welcome_word: [],
  }),
  mounted() {
    // get some random new words
    let new_word_num = 2;
    this.get_new_words(new_word_num);
    // console.log(this.welcome_word);
  },
  methods: {
    ...mapMutations([]),
    async get_new_words(num) {
      let api_key = this.app_data.wordnik_key;
      let random_word_api = `https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=${num}&api_key=${api_key}`;
      let response = await fetch(random_word_api);
      let word = await response.json();

      for (var i = 0; i < word.length; i++) {
        let word_defination = await fetch(
          `http://api.wordnik.com/v4/word.json/${word[i].word}/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=${api_key}`
        );
        let word_example = await fetch(
          `https://api.wordnik.com/v4/word.json/${word[i].word}/examples?includeDuplicates=false&useCanonical=false&limit=3&api_key=${api_key}`
        );

        word_example = await word_example.json();
        word_example = _.map(word_example.examples, (e) => e.text);
        word_defination = await word_defination.json();
        // console.log(word_defination);
        word_defination = _.map(word_defination, (d) => {
          return {
            text: d.text,
            partOfSpeech: d.partOfSpeech,
          };
        });

        this.welcome_word.push({
          word: word[i].word,
          audio_src: `https://www.google.com/speech-api/v1/synthesize?text=${word[i].word}&enc=mpeg&lang=en&speed=0.4&client=lr-language-tts&use_google_only_voices=1`,
          defination: word_defination,
          example: word_example,
          id: "welcome_word_" + word[i].word,
        });
      }
    },
  },
};
</script>
