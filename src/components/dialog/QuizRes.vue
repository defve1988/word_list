<template>
  <v-dialog v-model="app_data.quiz_res_dialog.show" width="500" persistent>
    <v-system-bar class="primary" dark> Quiz Result </v-system-bar>
    <v-card :color="app_data.theme_color.app_bg">
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
              :language="app_data.user.quiz.config.question_lan"
              :id="question.id"
              :numbered="index + 1"
            />
          </v-col>
          <v-col cols="4" align-self="center" align="center" class="px-0">
            <OneWord
              :word="question.correct_answer"
              :language="app_data.user.quiz.config.choice_lan"
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
        </v-row>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" class="mr-2" @click="discard_res">
          Discard
        </v-btn>
        <v-btn color="primary" class="mr-2" @click="confirm"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
// import _ from "underscore";
// import utilities from "@/app_class/utilities";

export default {
  data: () => ({}),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
  },
  watch: {},
  methods: {
    async confirm() {
      await this.app_data.user.quiz.summary();
      this.app_data.quiz_res_dialog.show = false;
    },

    discard_res() {
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