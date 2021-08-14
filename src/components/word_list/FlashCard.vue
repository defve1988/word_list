<template>
  <v-container>
    <v-hover v-slot="{ hover }">
      <transition name="flip">
        <v-card
          max-width="450"
          height="400"
          @click="flip_card"
          v-bind:key="front"
          :elevation="hover ? 8 : 4"
          :id="word.id"
        >
          <v-card-title class="pb-0" v-if="front">
            <a
              :href="`https://www.google.com/search?q=define+${word.word}`"
              target="_blank"
            >
              {{ word.word }}
            </a>
            <v-spacer></v-spacer>
            <v-btn icon @click="clicked" @click.native.stop>
              <v-icon>mdi-volume-high</v-icon>
            </v-btn>
            <audio
              :id="word.id + '_audio'"
              preload="auto"
              type="audio/mpeg"
              :src="word.audio_src"
            ></audio>
          </v-card-title>

          <v-card-title class="pb-0" v-else> Examples </v-card-title>

          <v-list v-if="front">
            <v-list-item v-for="(item, i) in word.defination" :key="i">
              <v-list-item-content>
                <i>{{ i + 1 }}. {{ item.partOfSpeech }}</i>
                <span v-html="item.text"></span>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-list v-else>
            <v-list-item v-for="(item, i) in word.example" :key="i">
              <v-list-item-content>
                <span v-html="i + 1 + '. ' + item"></span>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </transition>
    </v-hover>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "FlashCard",
  props: ["word"],
  mounted() {},
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
  },
  watch: {},
  data: () => ({
    front: true,
  }),
  methods: {
    ...mapMutations([]),
    clicked() {
      document.getElementById(this.word.id + "_audio").play();
    },
    flip_card() {
      this.front = !this.front;
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
</style>