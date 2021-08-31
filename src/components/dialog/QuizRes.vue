<template>
  <v-dialog v-model="app_data.quiz_res_dialog.show" width="500" persistent>
    <v-system-bar class="primary" dark> Quiz Result </v-system-bar>
    <v-card :color="app_data.theme_color.app_bg">
      <v-card-title>
        <span :style="`color:${app_data.theme_color.content}`">
          <span class="mr-15">
            {{ comment }}
          </span>
          Your score is
          <span style="color: #eb4034; border-bottom: 3px double">
            {{ score }}
          </span>
        </span>
      </v-card-title>
      <v-list
        v-for="(question, index) of app_data.user.quiz.quiz_list"
        :key="index"
        class="mx-3 py-0"
        dense
        :color="app_data.theme_color.app_bg"
      >
        <v-row
          class="ma-0 record-row"
          :style="`border-color:${app_data.theme_color.content}`"
        >
          <v-col cols="4" align-self="center" align="center" class="px-0">
            <OneWord
              :word="question.question"
              :language="question_lan"
              :id="question.id"
              :numbered="index + 1"
            />
          </v-col>
          <v-col cols="4" align-self="center" align="center" class="px-0">
            <OneWord
              :word="question.correct_answer"
              :language="choice_lan"
              :id="question.id"
              :numbered="false"
            />
          </v-col>
          <v-col cols="3" align-self="center" align="center" class="px-0">
            <v-icon style="color: green" v-if="question.correct">
              mdi-check
            </v-icon>
            <v-icon style="color: red" v-else> mdi-close </v-icon>
          </v-col>

          <!-- <v-col
            cols="3"
            align-self="center"
            align="center"
            class="px-0"
            :style="`color:${app_data.theme_color.content}`"
          >
            {{
              question.uploads == undefined
                ? ""
                : Math.floor(question.uploads.plus)
            }}
          </v-col> -->
        </v-row>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" class="mr-2" @click="discard_res"> Discard </v-btn>
        <v-btn color="primary" class="mr-2" @click="confirm"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
// import _ from "underscore";
import utilities from "@/app_class/utilities";

export default {
  data: () => ({}),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    question_lan() {
      return utilities.display2key([
        this.app_data.user.quiz.config.question_lan,
      ])[0];
    },
    choice_lan() {
      return utilities.display2key([
        this.app_data.user.quiz.config.choice_lan,
      ])[0];
    },
    score() {
      return Math.floor(
        (1 -
          this.app_data.user.quiz.score.error /
            this.app_data.user.quiz.score.tested) *
          100
      );
    },
    comment() {
      let comment = "";
      if (this.score == 100) comment = "Excellent!";
      else if (this.score >= 90) comment = "Goog job!";
      else if (this.score >= 80) comment = "Well Done.";
      else if (this.score < 60) comment = "You can do better.";
      return comment;
    },
  },
  watch: {},
  methods: {
    async confirm() {
      // let response_score = {
      //   excellent: this.app_data.learning.learning_excellent_scores,
      //   nice: this.app_data.learning.learning_nice_scores,
      //   ok: this.app_data.learning.learning_ok_scores,
      //   correct: this.app_data.learning.learning_correct_score,
      //   error: this.app_data.learning.learning_error_score,
      //   excellent_chain: this.app_data.learning.learning_excellent_chain_award,
      //   nice_chain: this.app_data.learning.learning_nice_chain_award,
      //   time_effect: this.app_data.learning.learning_time_award_effected,
      // };
      // if (this.app_data.quiz_dialog.quiz_type == "Spell") {
      //   response_score.excellent *= 3;
      //   response_score.nice *= 3;
      //   response_score.ok *= 3;
      //   response_score.correct *= 3;
      // }
      await this.app_data.user.quiz.upload_res();
      this.app_data.quiz_res_dialog.show = false;
    },

    discard_res() {
      // console.log(this.app_data.user.quiz);
      this.app_data.quiz_res_dialog.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.record-row {
  transition: all 0.1s;
  border-style: hidden hidden dashed hidden;
  border-width: 0.5px;
  &:hover {
    background-color: rgba(61, 61, 61, 0.85);
    color: #fff;
    .heart,
    .edit_note,
    .check,
    .label {
      color: #fff;
    }
  }
}
</style>