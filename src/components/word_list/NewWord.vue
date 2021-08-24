<template>
  <v-row class="ma-1 mb-3 row_header">
    <v-col
      cols="2"
      v-for="language in showned_language"
      :key="language.key"
      class="pa-0 mx-0"
    >
      <v-text-field
        class="new_word_input"
        :lan="language.key"
        :id="`new_word_${language.key}`"
        :label="language.display"
        @keydown="key_down"
        prepend-icon="mdi-close"
        @click:prepend="hide_language(language.en)"
        hide-details
        :style="`color:${app_data.theme_color.content}`"
        :dark="app_data.theme.brightness <= 50"
      ></v-text-field>
    </v-col>

    <v-col class="mr-3" align-self="end">
      <v-menu offset-y :disabled="unshowned_language.length == 0">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :class="
              unshowned_language.length == 0 ? 'primary lighten-1' : 'primary'
            "
            :elevation="unshowned_language.length == 0 ? 0 : 3"
            :dark="app_data.theme.brightness <= 50"
            v-bind="attrs"
            v-on="on"
            fab
            x-small
          >
            <v-icon
              :color="unshowned_language.length == 0 ? 'grey darken-1' : ''"
            >
              mdi-plus
            </v-icon>
          </v-btn>
        </template>
        <v-list :dark="app_data.theme.brightness <= 50">
          <v-list-item
            v-for="language in unshowned_language"
            :key="language.key"
            @click="show_language(language.en)"
          >
            <v-img
              max-height="15"
              max-width="25"
              :src="app_data.world_language[language.en].flag"
              class="mr-3"
            ></v-img>
            <v-list-item-title>{{ language.display }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import _ from "underscore";
import utilities from "@/app_class/utilities";

export default {
  name: "new_word",
  props: [],
  mounted() {},
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    showned_language() {
      let res = [];
      this.app_data.user.notebooks.currNotebook.languages.forEach((lan) => {
        if (
          this.app_data.user.notebooks.currNotebook.languages_details[lan].show
        ) {
          res.push(
            this.app_data.user.notebooks.currNotebook.languages_details[lan]
          );
        }
      });
      return res;
    },
    unshowned_language() {
      let res = [];
      this.app_data.user.notebooks.currNotebook.languages.forEach((lan) => {
        if (
          !this.app_data.user.notebooks.currNotebook.languages_details[lan].show
        ) {
          res.push(
            this.app_data.user.notebooks.currNotebook.languages_details[lan]
          );
        }
      });
      return res;
    },
  },
  watch: {},
  data: () => ({
    record: {},
  }),
  methods: {
    ...mapMutations([]),
    get_src(word, key) {
      return `https://www.google.com/speech-api/v1/synthesize?text=${word}&enc=mpeg&lang=${key}&speed=0.4&client=lr-language-tts&use_google_only_voices=1`;
    },
    async key_down(event) {
      this.app_data.word_list_loaded = true;
      if (event.keyCode === 13) {
        let curr_lan = event.target.getAttribute("lan");
        // console.log(event.target.value);
        let index = _.findIndex(this.showned_language, (x) => {
          return x.key == curr_lan;
        });

        if (index + 1 == this.showned_language.length) {
          _.map(this.showned_language, (l) => {
            let el = document.getElementById("new_word_" + l.key);
            let lan = el.getAttribute("lan");
            this.record[lan] = el.value;
          });

          // console.log(this.record);
          let duplicated =
            await this.app_data.user.notebooks.currNotebook.check_duplicate_word(
              this.record
            );

          let next_lan = this.showned_language[0].key;
          let el = document.getElementById(`new_word_${next_lan}`);
          this.select_all_input(el);

          // console.log(duplicated);
          if (duplicated == null) {
            await this.app_data.user.notebooks.currNotebook.add_record(
              this.record
            );
            for (var i = 0; i < this.showned_language.length; i++) {
              let lan_key = this.showned_language[i].key;
              if (i == 0) {
                await utilities.wait(500);
              }
              let audio = new Audio(
                this.get_src(this.record[lan_key], lan_key)
              );
              await utilities.playAudio(audio);
            }
          } else {
            console.log("Duplicated word " + duplicated);
          }

          // console.log(this.app_data.user.notebooks.currNotebook.word_list);
        } else {
          // this.record[curr_lan] = event.target.value;
          let next_lan = this.showned_language[index + 1].key;
          let el = document.getElementById(`new_word_${next_lan}`);
          this.select_all_input(el);
        }
      }
    },
    select_all_input(el) {
      el.focus();
      el.setSelectionRange(0, el.value.length);
    },
    hide_language(lan_en) {
      this.app_data.user.notebooks.currNotebook.languages_details[
        lan_en
      ].show = false;
      this.app_data.user.notebooks.currNotebook.languages.push(1);
      this.app_data.user.notebooks.currNotebook.languages.pop();
    },
    show_language(lan_en) {
      this.app_data.user.notebooks.currNotebook.languages_details[
        lan_en
      ].show = true;
      this.app_data.user.notebooks.currNotebook.languages.push(1);
      this.app_data.user.notebooks.currNotebook.languages.pop();
    },
  },
};
</script>

<style scoped lang="scss">
.new_word_input {
  font-weight: 600;
}
</style>