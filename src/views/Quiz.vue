<template>
  <v-container>
    <v-row class="ma-2">
      <v-btn @click="quiz_config" elevation="1" outlined small>Start</v-btn>
    </v-row>
    <v-row class="ma-0 mt-5 pa-0">
      <v-carousel
        v-model="quiz_index"
        :show-arrows="false"
        hide-delimiters
        v-if="app_data.quiz_dialog.created"
      >
        <v-carousel-item
          v-for="(question, question_index) in app_data.user.quiz.quiz_list"
          :key="question_index"
        >
          <v-sheet class="pt-10" height="100%" tile>
            <v-row class="pa-10" align="center" justify="center">
              <div class="text-h3" @click="play_aduio" style="cursor: pointer">
                {{ quiz_index + 1 }}. {{ question.question }}
              </div>
            </v-row>

            <v-row align="center" justify="center">
              <v-item-group>
                <v-container>
                  <v-row
                    v-for="(choice, index_choice) in question.choice"
                    :key="index_choice"
                    justify="center"
                    class="my-1"
                  >
                    <v-item>
                      <v-card flat @click="next_question(index_choice)">
                        <v-scroll-x-transition>
                          <div
                            class="text-h4 font-weight-light text-center pa-2"
                            :class="`choice_${index_choice}`"
                          >
                            {{ choice.text }}
                            <v-icon
                              style="color: green"
                              v-if="choice.isCorrect == true"
                            >
                              mdi-check
                            </v-icon>
                            <v-icon
                              style="color: red"
                              v-else-if="choice.isCorrect == false"
                            >
                              mdi-close
                            </v-icon>
                          </div>
                        </v-scroll-x-transition>
                      </v-card>
                    </v-item>
                  </v-row>
                </v-container>
              </v-item-group>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-row>
    <QuizRes />
    <QuizConfigure />
    <audio
      id="quiz_audio_1"
      preload="auto"
      type="audio/mpeg"
      :src="audio_src_1"
    ></audio>
    <audio
      id="quiz_audio_2"
      preload="auto"
      type="audio/mpeg"
      :src="audio_src_2"
    ></audio>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "quiz",
  data: () => ({
    colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
    quiz_index: 0,
    answer: null,
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    audio_src_1() {
      if (this.app_data.user.quiz.quiz_list.length == 0) return "";
      let language = this.app_data.quiz_dialog.config.question_lan;
      let word = this.app_data.user.quiz.quiz_list[this.quiz_index].question;
      return `https://www.google.com/speech-api/v1/synthesize?text=${word}&enc=mpeg&lang=${language}&speed=0.4&client=lr-language-tts&use_google_only_voices=1`;
    },
    audio_src_2() {
      if (this.app_data.user.quiz.quiz_list.length == 0) return "";
      let language = this.app_data.quiz_dialog.config.choice_lan;
      let word =
        this.app_data.user.quiz.quiz_list[this.quiz_index].correct_answer;
      return `https://www.google.com/speech-api/v1/synthesize?text=${word}&enc=mpeg&lang=${language}&speed=0.4&client=lr-language-tts&use_google_only_voices=1`;
    },
  },
  methods: {
    ...mapMutations([]),
    quiz_config() {
      console.log(this.app_data.quiz_dialog.created);
      this.quiz_index = 0;
      this.app_data.quiz_dialog.created = false;
      this.app_data.quiz_dialog.show = true;
    },

    play_aduio() {
      let audio1 = document.getElementById("quiz_audio_1");
      audio1.play();
    },

    async next_question(answer) {
      // console.log(this.quiz_index);
      this.answer = answer;
      let isCorrect =
        this.app_data.user.quiz.quiz_list[this.quiz_index].choice[this.answer]
          .correct;
      let el = document.getElementsByClassName(`choice_${this.answer}`);
      // handle correct or error animiation effect
      if (isCorrect) {
        this.app_data.user.quiz.quiz_list[this.quiz_index].choice[
          this.answer
        ].isCorrect = true;
        el.forEach((element) => {
          element.classList.add("correct");
        });
      } else {
        let correct_answer_index;
        for (var i = 0; i < this.app_data.quiz_dialog.config.choice_num; i++) {
          if (
            this.app_data.user.quiz.quiz_list[this.quiz_index].choice[i].correct
          ) {
            correct_answer_index = i;
          }
        }

        let correct_el = document.getElementsByClassName(
          `choice_${correct_answer_index}`
        );

        this.app_data.user.quiz.quiz_list[this.quiz_index].choice[
          correct_answer_index
        ].isCorrect = true;
        correct_el.forEach((element) => {
          element.classList.add("correct");
        });

        this.app_data.user.quiz.quiz_list[this.quiz_index].choice[
          this.answer
        ].isCorrect = false;

        el.forEach((element) => {
          element.classList.add("error");
        });
      }
      // record result
      this.app_data.user.quiz.quiz_list[this.quiz_index].correct = isCorrect;
      // play word audio
      if (this.app_data.quiz_dialog.play_audio) {
        let audio1 = document.getElementById("quiz_audio_1");
        audio1.play();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        let audio2 = document.getElementById("quiz_audio_2");
        audio2.play();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      // goto next question
      if (!this.app_data.quiz_dialog.play_audio) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      if (this.quiz_index < this.app_data.quiz_dialog.config.question_num - 1) {
        this.quiz_index += 1;
      } else {
        this.quiz_index = 0;
        this.app_data.quiz_dialog.created = false;
        this.app_data.quiz_res_dialog.show = true;
      }
    },
  },
};
</script>
<style scoped lang="css">
.error {
  color: red !important;
  background-color: rgba(255, 44, 44, 0.356) !important;
}

.correct {
  color: green;
  background-color: rgba(0, 128, 0, 0.383);
}
</style>
