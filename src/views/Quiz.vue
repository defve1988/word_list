<template>
  <v-container>
    <v-row class="ma-2">
      <v-btn
        @click="quiz_config"
        elevation="1"
        outlined
        small
        :color="app_data.theme_color.content"
        >New Quiz</v-btn
      >
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
          <v-sheet
            class="pt-0"
            height="100%"
            tile
            :color="app_data.theme_color.app_bg"
          >
            <v-container fill-height fluid>
              <!-- <v-row class="ma-0 pt-2 px-2">
                <v-col align-self="end" align="end" class="ma-0 pa-0 px-2">
                  {{ quiz_index + 1 }}/{{
                    app_data.quiz_dialog.config.question_num
                  }}
                </v-col>
              </v-row> -->

              <v-row
                class="pa-5 pb-0"
                align-self="center"
                justify="center"
                :style="`color:${app_data.theme_color.content}`"
              >
                <div
                  class="text-h3"
                  @click="play_aduio_1"
                  style="cursor: pointer"
                  v-if="quiz_type == 'Word-Word'"
                >
                  {{ quiz_index + 1 }}. {{ question.question }}
                </div>

                <div class="text-h3" v-else>
                  {{ quiz_index + 1 }}.

                  <v-text-field
                    v-if="quiz_type == 'Spell'"
                    v-model="spell_answer"
                    :counter="question.question.length"
                    required
                    height="60"
                    class="spell_input text-h5 font-weight-light mx-2 pa-3"
                    @keydown="key_down"
                    :id="`spell_${question_index}`"
                    :dark="app_data.theme.brightness <= 50"
                  ></v-text-field>

                  <v-scroll-x-transition>
                    <div
                      v-if="show_answer"
                      class="display-1 mx-5"
                      align="center"
                      :class="isCorrect ? 'correct' : 'error'"
                    >
                      {{ question.question }}
                    </div>
                  </v-scroll-x-transition>

                  <v-btn
                    icon
                    class="ml-3"
                    @click="play_aduio_1"
                    :color="app_data.theme_color.content"
                  >
                    <v-icon> mdi-volume-high </v-icon>
                  </v-btn>
                </div>
              </v-row>

              <v-row
                align="start"
                align-self="start"
                justify="center"
                v-if="quiz_type != 'Spell'"
              >
                <v-item-group>
                  <v-container>
                    <v-row
                      v-for="(choice, index_choice) in question.choice"
                      :key="index_choice"
                      justify="center"
                    >
                      <v-item>
                        <v-card
                          flat
                          @click="next_question(index_choice)"
                          :color="app_data.theme_color.app_bg"
                          :style="`color:${app_data.theme_color.content}`"
                        >
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
              <v-row>
                <v-spacer></v-spacer>
              </v-row>
            </v-container>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-row>
    <v-row justify="center" v-if="show_question_response">
      <v-col>
        <v-card
          flat
          :color="app_data.theme_color.app_bg"
          :style="`color:${app_data.theme_color.content}`"
          class="display-1"
        >
          <v-scroll-x-transition>
            <div :class="question_response.class" align="end">
              {{ question_response.text }}
            </div>
          </v-scroll-x-transition>
        </v-card>
      </v-col>
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
import utilities from "@/app_class/utilities";

export default {
  name: "quiz",
  data: () => ({
    colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
    quiz_index: 0,
    answer: null,
    spell_answer: "",
    isCorrect: true,
    show_answer: false,
    question_start: null,
    question_answered: null,
    show_question_response: false,
    question_response: {},
    buffer_time: 150,
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    quiz_type() {
      return this.app_data.quiz_dialog.quiz_type;
    },
    audio_src_1() {
      if (this.app_data.user.quiz.quiz_list.length == 0) return "";
      let language = utilities.display2key([
        this.app_data.quiz_dialog.config.question_lan,
      ])[0];
      let word = this.app_data.user.quiz.quiz_list[this.quiz_index].question;
      return `https://www.google.com/speech-api/v1/synthesize?text=${word}&enc=mpeg&lang=${language}&speed=0.4&client=lr-language-tts&use_google_only_voices=1`;
    },
    audio_src_2() {
      if (this.app_data.user.quiz.quiz_list.length == 0) return "";
      let language = utilities.display2key([
        this.app_data.quiz_dialog.config.choice_lan,
      ])[0];
      let word =
        this.app_data.user.quiz.quiz_list[this.quiz_index].correct_answer;
      return `https://www.google.com/speech-api/v1/synthesize?text=${word}&enc=mpeg&lang=${language}&speed=0.4&client=lr-language-tts&use_google_only_voices=1`;
    },
    currQuestion() {
      return this.app_data.user.quiz.quiz_list[this.quiz_index];
    },
  },
  watch: {
    audio_src_1() {
      // this means a new question is given
      this.question_start = new Date();
      let audio = document.getElementById("quiz_audio_1");
      audio.onended = () => {};
      this.play_aduio_1();
      if (this.quiz_type == "Spell") {
        this.set_question_focus(0);
      }
    },
  },
  methods: {
    ...mapMutations([]),
    async set_question_focus() {
      await new Promise((resolve) => setTimeout(resolve, 100));
      let el = document.getElementById(`spell_${this.quiz_index}`);
      el.focus();
    },

    quiz_config() {
      // console.log(this.app_data.quiz_dialog.created);
      this.quiz_index = 0;
      this.app_data.quiz_dialog.created = false;
      this.app_data.quiz_dialog.show = true;
    },

    async play_aduio_1() {
      // todo: this is not good enough, need to check the networkstate
      // console.log(audio1.networkState)
      await new Promise((resolve) => setTimeout(resolve, 200));
      let audio = document.getElementById("quiz_audio_1");
      audio.play();
    },
    async play_aduio_2() {
      // todo: this is not good enough, need to check the networkstate
      // console.log(audio1.networkState)
      let audio = document.getElementById("quiz_audio_2");
      audio.play();
    },

    get_question_response(isCorrect) {
      let excellent_response =
        this.app_data.user.quiz.config.excellent_response * 1000;
      if (this.quiz_type == "Spell") {
        excellent_response *= 5;
        // console.log(excellent_response)
      }
      let response_time =
        this.question_answered - this.question_start - this.buffer_time;
      // console.log(response_time)
      let response = {
        text: "",
        score: 0,
        class: "",
      };
      if (!isCorrect) {
        response.type = "error";
        response.text = "Try next time.";
        response.class = "error_response";
      } else if (response_time <= excellent_response) {
        response.type = "excellent";
        response.text = "Excellent!";
        response.class = "excellent_response";
      } else if (response_time <= excellent_response * 2) {
        response.type = "nice";
        response.text = "Nice!";
        response.class = "nice_response";
      } else if (response_time <= excellent_response * 3) {
        response.type = "ok";
        response.text = "OK.";
        response.class = "ok_response";
      } else {
        response.type = "correct";
        response.text = "Correct.";
        response.class = "correct_response";
      }
      return response;
    },

    key_down(e) {
      if (e.keyCode === 13) {
        this.question_answered = new Date();
        this.show_question_response = true;
        let isCorrect = this.spell_answer == this.currQuestion.question;
        this.question_response = this.get_question_response(isCorrect);
        this.isCorrect = isCorrect;
        this.app_data.user.quiz.quiz_list[this.quiz_index].correct = isCorrect;
        this.app_data.user.quiz.quiz_list[this.quiz_index].response = {
          response: this.question_response.type,
          quiz_type: this.quiz_type,
        };

        this.show_answer = true;
        let audio = document.getElementById("quiz_audio_1");
        audio.play();
        audio.onended = () => {
          this.set_next_question();
        };
      }
    },

    async next_question(answer) {
      // console.log(this.quiz_index);
      this.question_answered = new Date();
      this.show_question_response = true;

      this.answer = answer;
      let isCorrect =
        this.app_data.user.quiz.quiz_list[this.quiz_index].choice[this.answer]
          .correct;
      let el = document.getElementsByClassName(`choice_${this.answer}`);
      // handle correct or error animiation effect
      this.app_data.user.quiz.score.tested += 1;
      this.question_response = this.get_question_response(isCorrect);
      if (isCorrect) {
        this.app_data.user.quiz.quiz_list[this.quiz_index].choice[
          this.answer
        ].isCorrect = true;
        el.forEach((element) => {
          element.classList.add("correct");
        });
      } else {
        this.app_data.user.quiz.score.error += 1;
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
      this.app_data.user.quiz.quiz_list[this.quiz_index].response = {
        response: this.question_response.type,
        quiz_type: this.quiz_type,
      };

      // play word audio
      if (this.app_data.quiz_dialog.play_audio) {
        let audio = document.getElementById("quiz_audio_2");
        audio.play();
        audio.onended = () => {
          this.set_next_question();
        };
      } else {
        // goto next question
        this.set_next_question();
      }
    },
    async set_next_question() {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (this.quiz_index < this.app_data.quiz_dialog.config.question_num - 1) {
        this.quiz_index += 1;
      } else {
        this.quiz_index = 0;
        this.app_data.quiz_dialog.created = false;

        let response_score = {
          excellent: this.app_data.learning.learning_excellent_scores,
          nice: this.app_data.learning.learning_nice_scores,
          ok: this.app_data.learning.learning_ok_scores,
          correct: this.app_data.learning.learning_correct_score,
          error: this.app_data.learning.learning_error_score,
          excellent_chain:
            this.app_data.learning.learning_excellent_chain_award,
          nice_chain: this.app_data.learning.learning_nice_chain_award,
          time_effect: this.app_data.learning.learning_time_award_effected,
        };
        if (this.app_data.quiz_dialog.quiz_type == "Spell") {
          response_score.excellent *= 3;
          response_score.nice *= 3;
          response_score.ok *= 3;
          response_score.correct *= 3;
        }

        this.app_data.user.quiz.summary(response_score);
        this.app_data.quiz_res_dialog.show = true;
      }
      this.show_answer = false;
      this.show_question_response = false;
      this.question_start = new Date();
      this.spell_answer = "";
    },
  },
};
</script>
<style scoped lang="scss">
.error {
  color: red !important;
  background-color: rgba(255, 44, 44, 0.4) !important;
}

.correct {
  color: rgb(0, 255, 0);
  background-color: rgba(0, 128, 0, 0.4);
}

.error_response {
  color: rgba(255, 44, 44);
}
.excellent_response {
  color: rgb(183, 0, 255);
}
.nice_response {
  color: rgb(0, 255, 157);
}
.ok_response {
  color: rgb(0, 255, 0);
}
.correct_response {
  color: rgb(255, 208, 0);
}
</style>
