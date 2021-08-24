<template>
  <v-hover v-slot="{ hover }">
    <v-card
      height="80"
      width="150"
      :class="app_data.word_grid_loaded ? '' : 'enter_row'"
      :style="`animation-delay:${index * delay_ratio}ms;`"
      @click="play"
      :color="app_data.theme_color.card_bg"
      :dark="app_data.theme.brightness <= 50"
    >
      <div style="flex: 1" class="d-flex justify-end">
        <v-btn
          icon
          x-small
          class="ma-0 pa-0 ml-1"
          :class="word.favorite ? 'favorite' : ''"
          @click="add_favorite"
          @click.native.stop
          :style="`color:${app_data.theme_color.content}`"
        >
          <v-icon x-small> mdi-heart </v-icon>
        </v-btn>

        <v-btn
          icon
          x-small
          class="ma-0 pa-0 mr-1"
          :class="word.mastered ? 'mastered' : ''"
          @click="add_mastered"
          @click.native.stop
          :style="`color:${app_data.theme_color.content}`"
        >
          <v-icon x-small> mdi-check-bold </v-icon>
        </v-btn>
      </div>
      <transition name="flip">
        <v-card-text
          style="text-align: center"
          v-bind:key="hover"
          :style="`color:${app_data.theme_color.content}`"
        >
          <div v-if="!hover">
            {{ word[front_key] }}
          </div>

          <div v-else>
            {{ word[back_key] }}
          </div>
        </v-card-text>
      </transition>
      <audio
        :id="`audio_front_${word.id}`"
        preload="auto"
        type="audio/mpeg"
        :src="audio_src_front"
      ></audio>
      <audio
        :id="`audio_back_${word.id}`"
        preload="auto"
        type="audio/mpeg"
        :src="audio_src_back"
      ></audio>
    </v-card>
  </v-hover>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import _ from "underscore";

export default {
  name: "FlashCard",
  props: ["word", "index"],
  mounted() {},
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
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
    audio_src_front() {
      return `https://www.google.com/speech-api/v1/synthesize?text=${
        this.word[this.front_key]
      }&enc=mpeg&lang=${
        this.front_key
      }&speed=0.4&client=lr-language-tts&use_google_only_voices=1`;
    },

    audio_src_back() {
      return `https://www.google.com/speech-api/v1/synthesize?text=${
        this.word[this.back_key]
      }&enc=mpeg&lang=${
        this.back_key
      }&speed=0.4&client=lr-language-tts&use_google_only_voices=1`;
    },
  },
  watch: {},
  data: () => ({
    front: true,
    delay_ratio: 10,
  }),
  methods: {
    ...mapMutations([]),
    clicked() {
      document.getElementById(this.word.id + "_audio").play();
    },
    flip_card() {
      this.front = !this.front;
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
    play() {
      let audio_1 = document.getElementById(`audio_front_${this.word.id}`);
      audio_1.play();
      audio_1.onended = () => {
        let audio_2 = document.getElementById(`audio_back_${this.word.id}`);
        audio_2.play();
      };
    },
  },
};
</script>

<style scoped lang="scss">
.v-card {
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
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

@keyframes slide_in {
  from {
    transform: translateX(-500px);
    opacity: 0;
    visibility: hidden;
  }
  to {
    transform: translateX(0px);
    opacity: 1;
    visibility: visible;
  }
}

.enter_row {
  animation-name: slide_in;
  animation-duration: 600ms;
  animation-fill-mode: both;
}

.favorite {
  color: #e91e63 !important;
}
.mastered {
  color: #2cc026 !important;
}
</style>