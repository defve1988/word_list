<template>
  <v-container fluid>
    <v-carousel
      hide-delimiters
      v-model="card_index"
      prev-icon="mdi-arrow-left"
      next-icon="mdi-arrow-right"
    >
      <v-carousel-item v-for="(word, index) in word_list" :key="index">
        <v-container fill-height>
          <v-row align-self="center" justify="center">
            <v-col justify="center" cols="10">
              <transition name="flip">
                <v-card
                  class="text-h3"
                  height="400"
                  v-bind:key="flipped"
                  :color="app_data.theme_color.card_bg"
                  :dark="app_data.theme.brightness <= 50"
                >
                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      icon
                      class="ma-0 pa-0 ml-1"
                      @click="hide_text = !hide_text"
                      @click.native.stop
                      :color="app_data.theme_color.content"
                      :dark="app_data.theme.brightness <= 50"
                    >
                      <v-icon v-if="!hide_text">mdi-format-clear</v-icon>
                      <v-icon v-else>mdi-format-text</v-icon>
                    </v-btn>

                    <v-btn
                      icon
                      class="ma-0 pa-0 ml-1"
                      @click="play_aduio"
                      @click.native.stop
                      :color="app_data.theme_color.content"
                      :dark="app_data.theme.brightness <= 50"
                    >
                      <v-icon>mdi-volume-high</v-icon>
                    </v-btn>

                    <v-btn
                      icon
                      class="ma-0 pa-0 ml-1"
                      @click="flipped = !flipped"
                      @click.native.stop
                      :color="app_data.theme_color.content"
                      :dark="app_data.theme.brightness <= 50"
                    >
                      <v-icon>mdi-sync </v-icon>
                    </v-btn>

                    <v-btn
                      icon
                      class="ma-0 pa-0 ml-1"
                      :class="word.favorite ? 'favorite' : ''"
                      @click="add_favorite"
                      @click.native.stop
                      :color="app_data.theme_color.content"
                      :dark="app_data.theme.brightness <= 50"
                    >
                      <v-icon> mdi-heart </v-icon>
                    </v-btn>

                    <v-btn
                      icon
                      class="ma-0 pa-0 mr-1"
                      :class="word.mastered ? 'mastered' : ''"
                      @click="add_mastered"
                      @click.native.stop
                      :color="app_data.theme_color.content"
                      :dark="app_data.theme.brightness <= 50"
                    >
                      <v-icon> mdi-check-bold </v-icon>
                    </v-btn>
                  </v-card-actions>
                  <v-hover v-slot="{ hover }">
                    <v-container style="height: 300px" fill-height>
                      <v-row align-self="center">
                        <v-col align="center">
                          <div class="display-1" :style="`color:${app_data.theme_color.content}`">
                            <span
                              v-if="
                                (!flipped && !hide_text) || (!flipped && hover)
                              "
                            >
                              {{ word[front_key] }}
                            </span>

                            <span
                              v-else-if="
                                (flipped && !hide_text) || (flipped && hover)
                              "
                            >
                              {{ word[back_key] }}
                            </span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-hover>
                </v-card>
              </transition>
            </v-col>
          </v-row>
        </v-container>
      </v-carousel-item>
    </v-carousel>
    <v-row>
      <v-spacer> </v-spacer>
      <v-col class="mr-10" cols="2">
        <pre
          class="overline"
          style="text-align: start"
          :style="`color:${app_data.theme_color.content}`"
        >
    play audio: space 
    filp card:           F
    Hide text:           E
    previou/next: A/W
    </pre
        >
      </v-col>
    </v-row>

    <audio
      id="card_audio"
      preload="auto"
      type="audio/mpeg"
      :src="card_audio_src"
    ></audio>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import _ from "underscore";

export default {
  name: "one_row",
  props: ["record", "row_index"],
  data: () => ({
    card_index: 0,
    flipped: false,
    hide_text: false,
  }),
  mounted() {
    document.addEventListener("keypress", this.key_pressed);
  },
  watch: {
    card_audio_src() {
      this.play_aduio();
    },
  },
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    word() {
      return this.app_data.user.notebooks.currNotebook.word_list[
        this.card_index
      ];
    },
    card_audio_src() {
      let lan_key = this.flipped ? this.back_key : this.front_key;
      return `https://www.google.com/speech-api/v1/synthesize?text=${this.word[lan_key]}&enc=mpeg&lang=${lan_key}&speed=0.4&client=lr-language-tts&use_google_only_voices=1`;
    },
    word_list() {
      return this.app_data.user.notebooks.currNotebook.word_list.filter(
        (w) => w.show
      );
    },
    languages() {
      let res = [];
      this.app_data.user.notebooks.currNotebook.languages.forEach((lan) => {
        res.push(
          this.app_data.user.notebooks.currNotebook.languages_details[lan]
        );
      });
      return res;
    },

    front_key() {
      if (this.app_data.card_front == null) {
        return this.languages[1].key;
      } else {
        return this.app_data.card_front.key;
      }
    },
    back_key() {
      if (this.app_data.card_back == null) {
        return this.languages[0].key;
      } else {
        return this.app_data.card_back.key;
      }
    },
  },
  methods: {
    ...mapMutations([]),
    key_pressed(e) {
      // console.log(e);
      if (e.code == "Space") this.play_aduio();
      if (e.code == "KeyE") this.hide_text = !this.hide_text;
      if (e.code == "KeyF") this.flipped = !this.flipped;
      // if (e.keyCode == 103) this.add_favorite();
      // if (e.keyCode == 13) this.add_mastered();
      if (e.code == "KeyD") {
        this.card_index += 1;
        if (this.card_index > this.word_list.length - 1) this.card_index = 0;
      }
      if (e.code == "KeyA") {
        this.card_index -= 1;
        if (this.card_index < 0) this.card_index = this.word_list.length - 1;
      }
    },
    play_aduio() {
      let el = document.getElementById("card_audio");
      setTimeout(
        (el) => {
          el.play();
        },
        200,
        el
      );
    },
    add_favorite() {
      this.app_data.user.notebooks.currNotebook
        .update_record(this.word.id, {
          favorite: !this.word.favorite,
        })
        .then((response) => {
          if (response) {
            this.word.favorite = !this.word.favorite;
          }
        });
    },
    add_mastered() {
      this.app_data.user.notebooks.currNotebook
        .update_record(this.word.id, {
          mastered: !this.word.mastered,
        })
        .then(() => {
          if (this.word.mastered) {
            var index = _.findIndex(
              this.app_data.user.notebooks.currNotebook.word_list,
              {
                id: this.word.id,
              }
            );
            console.log(index);
            this.app_data.user.notebooks.currNotebook.word_list[
              index
            ].show = false;
          }
        });
    },
    key_down(e) {
      if (e.keyCode === 39) {
        console.log(this.card_index);
        this.card_index += 1;
      }
      if (e.keyCode === 37) {
        console.log(this.card_index);
        this.card_index -= 1;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.list-complete-item {
  transition: all 0.5s;
  margin-right: 10px;
}
.list-complete-enter
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(100px);
}

.flip-enter-active {
  transition: all 0.4s ease;
}

.flip-leave-active {
  display: none;
}

.flip-enter,
.flip-leave {
  transform: rotateY(180deg);
  opacity: 0;
}

.favorite {
  color: #e91e63 !important;
}
.mastered {
  color: #2cc026 !important;
}
</style>