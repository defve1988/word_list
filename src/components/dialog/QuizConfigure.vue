<template>
  <v-dialog v-model="app_data.quiz_dialog.show" width="500" persistent>
    <v-system-bar class="primary" dark> Start a new quiz </v-system-bar>
    <v-card :color="app_data.theme_color.app_bg">
      <v-list
        shaped
        dense
        :color="app_data.theme_color.app_bg"
        :dark="app_data.theme.brightness <= 50"
      >
        <v-list-item class="my-5">
          <v-combobox
            v-model="selected_quiz_type"
            :items="quiz_type"
            label="Select quiz type"
            outlined
            dense
            hide-details
            class="mr-2"
          ></v-combobox>

          <v-combobox
            v-model="range"
            :items="quiz_range"
            label="Select quiz range"
            outlined
            dense
            hide-details
            class="ml-2"
          ></v-combobox>
        </v-list-item>

        <v-list-item class="my-5">
          <v-combobox
            v-model="selected_notebook"
            :items="notebook_names"
            label="Select a notebook"
            outlined
            dense
            hide-details
          ></v-combobox>
        </v-list-item>

        <v-list-item class="my-5">
          <v-combobox
            v-model="question_lan"
            :items="selected_notebook_languages"
            label="Question languages"
            outlined
            dense
            class="mr-2"
            hide-details
          ></v-combobox>
          <v-btn icon @click="switch_lr">
            <v-icon>mdi-arrow-left-right-bold</v-icon>
          </v-btn>
          <v-combobox
            v-model="choice_lan"
            :items="selected_notebook_languages"
            label="Choice languages"
            outlined
            dense
            class="ml-2"
            hide-details
            :disabled="selected_quiz_type == 'Spell'"
          ></v-combobox>
        </v-list-item>

        <v-list-item class="mt-8 mb-3">
          <v-slider
            v-model="question_num"
            step="1"
            thumb-label="always"
            :thumb-size="24"
            min="1"
            max="50"
            label="Question number"
            :color="app_data.theme_color.content"
            hide-details
          ></v-slider>
        </v-list-item>

        <v-list-item class="my-3">
          <v-slider
            v-model="choice_num"
            step="1"
            thumb-label="always"
            :thumb-size="24"
            min="3"
            max="6"
            ticks
            tick-size="5"
            label="Choice number"
            :color="app_data.theme_color.content"
            hide-details
            :disabled="selected_quiz_type == 'Spell'"
          ></v-slider>
        </v-list-item>

        <v-list-item class="my-3">
          <v-slider
            v-model="excellent_response"
            step="0.5"
            thumb-label="always"
            :thumb-size="24"
            min="1"
            max="3"
            ticks
            tick-size="5"
            label="Excellent Response Time (s)"
            hint="Spell quiz type will five times as this value"
            persistent-hint
            :color="app_data.theme_color.content"
          ></v-slider>
        </v-list-item>

        <v-list-item class="my-3">
          <!-- <v-checkbox
            v-model="app_data.quiz_dialog.play_audio_1"
            label="Play question audio"
            class="mr-2"
          ></v-checkbox> -->

          <v-checkbox
            v-model="app_data.quiz_dialog.play_audio"
            label="Play audio for correct answer"
            class="ml-2"
            dense
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
    quiz_type: ["Word-Word", "Voice-Word", "Spell"],
    quiz_range: ["Necessary", "All", "Favorite", "Note Mastered", "Mastered"],
  }),
  mounted() {
    // let res = this.app_data.user.notebooks.noteBooks.map((id) => {
    //   return this.app_data.user.notebooks.noteBook_detail[id].notebook_name;
    // });
    // this.selected_notebook = res[0];
  },
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    selected_quiz_type: {
      get() {
        return this.app_data.quiz_dialog.quiz_type;
      },
      set(val) {
        this.app_data.quiz_dialog.quiz_type = val;
      },
    },

    selected_notebook: {
      get() {
        return this.app_data.quiz_dialog.notebook_name;
      },
      set(val) {
        this.app_data.quiz_dialog.notebook_name = val;
      },
    },
    excellent_response: {
      get() {
        return this.app_data.quiz_dialog.config.excellent_response;
      },
      set(val) {
        this.app_data.quiz_dialog.config.excellent_response = val;
      },
    },

    question_num: {
      get() {
        return this.app_data.quiz_dialog.config.question_num;
      },
      set(val) {
        this.app_data.quiz_dialog.config.question_num = val;
      },
    },
    choice_num: {
      get() {
        return this.app_data.quiz_dialog.config.choice_num;
      },
      set(val) {
        this.app_data.quiz_dialog.config.choice_num = val;
      },
    },
    question_lan: {
      get() {
        return this.app_data.quiz_dialog.config.question_lan;
      },
      set(val) {
        this.app_data.quiz_dialog.config.question_lan = val;
      },
    },
    choice_lan: {
      get() {
        return this.app_data.quiz_dialog.config.choice_lan;
      },
      set(val) {
        this.app_data.quiz_dialog.config.choice_lan =  val;
      },
    },
    range: {
      get() {
        return this.app_data.quiz_dialog.config.range;
      },
      set(val) {
        this.app_data.quiz_dialog.config.range = val;
      },
    },
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
      this.app_data.quiz_dialog.config.question_lan = this.selected_notebook_languages[0];
      this.app_data.quiz_dialog.config.choice_lan = this.selected_notebook_languages[1];
    },
  },
  methods: {
    switch_lr() {
      let temp = this.question_lan;
      this.question_lan = this.choice_lan;
      this.choice_lan = temp;
    },
    async confirm() {
      // console.log(this.selected_notebook);

      let index = _.indexOf(this.notebook_names, this.selected_notebook);
      let id = this.app_data.user.notebooks.noteBooks[index];
      this.app_data.quiz_dialog.notebook_id = id;
      this.app_data.quiz_dialog.quiz_type = this.selected_quiz_type;
      this.app_data.quiz_dialog.config = {
        excellent_response: this.excellent_response,
        question_num: this.question_num,
        choice_num: this.choice_num,
        question_lan: this.question_lan,
        choice_lan: this.choice_lan,
        range: this.range,
      };

      if (this.selected_quiz_type == "Spell") {
        this.app_data.quiz_dialog.config.choice_num = 0;
      }
      // console.log(this.question_lan);
      // console.log(this.app_data.quiz_dialog);
      this.app_data.user.set_user_quiz_config(this.app_data.quiz_dialog)

      let created = await this.app_data.user.init_quiz(
        id,
        this.app_data.quiz_dialog.config
      );
      if (created) {
        this.app_data.quiz_dialog.created = true;
        this.app_data.quiz_dialog.show = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>