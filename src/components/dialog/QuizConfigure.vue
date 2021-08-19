<template>
  <v-dialog v-model="app_data.quiz_dialog.show" width="500" persistent>
    <v-system-bar class="primary" dark> Start a new quiz </v-system-bar>
    <v-card>
      <v-list shaped dense>
        <v-list-item class="mt-3">
          <v-combobox
            v-model="selected_quiz_type"
            :items="quiz_type"
            label="Select quiz type"
            outlined
            dense
            class="mr-2"
          ></v-combobox>

          <v-combobox
            v-model="range"
            :items="quiz_range"
            label="Select quiz range"
            outlined
            dense
            class="ml-2"
          ></v-combobox>
        </v-list-item>

        <v-list-item>
          <v-combobox
            v-model="selected_notebook"
            :items="notebook_names"
            label="Select a notebook"
            outlined
            dense
          ></v-combobox>
        </v-list-item>

        <v-list-item>
          <v-combobox
            v-model="question_lan"
            :items="selected_notebook_languages"
            label="Question languages"
            outlined
            dense
            :disabled="selected_quiz_type != 'Word-Word'"
            class="mr-2"
          ></v-combobox>
          <v-combobox
            v-model="choice_lan"
            :items="selected_notebook_languages"
            label="Choice languages"
            outlined
            dense
            class="ml-2"
          ></v-combobox>
        </v-list-item>

        <v-list-item>
          <v-slider
            v-model="question_num"
            step="1"
            thumb-label
            min="1"
            max="50"
            ticks
            label="Question number"
          ></v-slider>
        </v-list-item>

        <v-list-item>
          <v-slider
            v-model="choice_num"
            step="1"
            thumb-label
            min="3"
            max="6"
            ticks
            label="Choice number"
          ></v-slider>
        </v-list-item>

        <v-list-item>
          <v-checkbox
            v-model="app_data.quiz_dialog.play_audio_1"
            label="Play question audio"
            class="mr-2"
          ></v-checkbox>

          <v-checkbox
            v-model="app_data.quiz_dialog.play_audio_2"
            label="Play answer audio"
            class="ml-2"
          ></v-checkbox>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          class="mr-2"
          @click="app_data.quiz_dialog.show = false"
        >
          Cancel
        </v-btn>
        <v-btn color="primary" class="mr-2" @click="confirm"> Confirm </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import _ from "underscore";
import utilities from "@/app_class/utilities";

export default {
  data: () => ({
    selected_quiz_type: "Word-Word",
    quiz_type: ["Word-Word", "Voice-Word", "Spell"],
    selected_notebook: "",
    question_num: 20,
    choice_num: 4,
    question_lan: "",
    choice_lan: "",
    range: "Necessary",
    quiz_range: ["Necessary", "All", "Favorite", "Note Mastered", "Mastered"],
  }),
  mounted() {
    let res = this.app_data.user.notebooks.noteBooks.map((id) => {
      return this.app_data.user.notebooks.noteBook_detail[id].notebook_name;
    });
    this.selected_notebook = res[0];
  },
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    notebook_names() {
      let res = this.app_data.user.notebooks.noteBooks.map((id) => {
        return this.app_data.user.notebooks.noteBook_detail[id].notebook_name;
      });
      return res;
    },
    selected_notebook_languages() {
      let index = _.indexOf(this.notebook_names, this.selected_notebook);
      let id = this.app_data.user.notebooks.noteBooks[index];
      return index == -1
        ? []
        : utilities.en2display(
            this.app_data.user.notebooks.noteBook_detail[id].languages
          );
    },
  },
  watch: {
    selected_notebook_languages() {
      this.question_lan = this.selected_notebook_languages[0];
      this.choice_lan = this.selected_notebook_languages[1];
    },
  },
  methods: {
    async confirm() {
      // console.log(this.selected_notebook);
      let index = _.indexOf(this.notebook_names, this.selected_notebook);
      let id = this.app_data.user.notebooks.noteBooks[index];
      this.app_data.quiz_dialog.notebook_id = id;
      this.app_data.quiz_dialog.quiz_type = this.selected_quiz_type;
      this.app_data.quiz_dialog.config = {
        question_num: this.question_num,
        choice_num: this.choice_num,
        question_lan: utilities.display2key([this.question_lan])[0],
        choice_lan: utilities.display2key([this.choice_lan])[0],
        range: this.range.toLowerCase(),
      };

      if (this.selected_quiz_type != "Word-Word") {
        this.app_data.quiz_dialog.config.question_lan =
          this.app_data.quiz_dialog.config.choice_lan;
      }

      if (this.selected_quiz_type == "Spell") {
        this.app_data.quiz_dialog.config.choice_num = 0;
      }

      await this.app_data.user.init_quiz(id, this.app_data.quiz_dialog.config);
      this.app_data.quiz_dialog.created = true;
      this.app_data.quiz_dialog.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>