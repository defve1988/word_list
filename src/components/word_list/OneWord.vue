<template>
  <div class="word_div">
    <span v-if="numbered" style="float: left"> {{ numbered }}. </span>
    <v-tooltip bottom :disabled="notes == '' || app_data.show_word_list_notes" nudge-bottom="10" max-width="300">
      <template v-slot:activator="{ on, attrs }">
        <span
          class="word"
          :id="`${word}_${language}_${id}`"
          :class="
            app_data.content_menu.target.id == `word_${id}` ? 'clicked' : ''
          "
          @contextmenu="show"
          @click="clicked"
          @dblclick="dblclick"
          @blur="lose_focus"
          @keydown="key_down"
          v-bind="attrs"
          v-on="on"
        >
          {{ word == "" ? empty_word : word }}
        </span>
      </template>
      <pre class="note_tooltip" style="max-width:300px" v-html="notes"></pre>
    </v-tooltip>

    <audio :id="`audio_${language}_${id}`" preload="auto" type="audio/mpeg" :src="audio_src"></audio>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import _ from "underscore";

export default {
  name: "one_word",
  props: ["word", "language", "id", "numbered"],
  data: () => ({
    empty_word: "------",
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    audio_src() {
      return `https://www.google.com/speech-api/v1/synthesize?text=${this.word}&enc=mpeg&lang=${this.language}&speed=0.4&client=lr-language-tts&use_google_only_voices=1`;
    },
    word_index() {
      return _.findIndex(this.app_data.user.notebooks.currNotebook.word_list, {
        id: this.id,
      });
    },
    notes() {
      return this.app_data.user.notebooks.currNotebook.word_list[
        this.word_index
      ].notes;
    },
  },
  methods: {
    ...mapMutations(["CONTENTMENU"]),
    clicked(e) {
      // if no word then edit(dblclick)
      if (e.target.innerText === this.empty_word) {
        this.dblclick;
      } else if (e.altKey) {
        this.app_data.notes_dialog = {
          show: true,
          id: this.id,
          language: this.language,
          word: this.word,
          notes: this.notes,
        };
      } else {
        document.getElementById(`audio_${this.language}_${this.id}`).play();
      }
    },
    dblclick(e) {
      // edit word
      e.target.setAttribute("contenteditable", true);
      this.focus_select(e.target);
    },
    key_down(e) {
      if (e.keyCode === 13) {
        // console.log(this.word, this.id, this.language,e.target.innerText)
        let prop = {};
        prop[this.language] = e.target.innerText;
        this.app_data.user.notebooks.currNotebook.update_record(this.id, prop);
        this.app_data.user.notebooks.currNotebook.word_list[this.word_index][
          this.language
        ] = e.target.innerText;

        e.target.setAttribute("contenteditable", false);
      }
    },
    focus_select(el) {
      el.focus();
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    },
    lose_focus(e) {
      if (e.target.innerText == "") {
        e.target.innerText = this.empty_word;
      }
      e.target.setAttribute("contenteditable", false);
    },
    show(e) {
      this.CONTENTMENU(e);
      this.$nextTick(() => {
        this.app_data.content_menu.show = true;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.note_tooltip{
  white-space: pre-wrap;
}
.word {
  cursor: pointer;
  font-weight: 300;
  float: center;
  min-height: 50px;

  &:hover {
    font-weight: 800;
    color: #9f9f;
  }
  &:focus {
    background-color: red;
  }
}
.clicked {
  font-weight: 800;
}
.word_div {
  border-right-style: solid;
  border-width: 1px;
}
.v-tooltip__content.menuable__content__active {
  background-color: rgba(0, 255, 0, 0.753);
  color: rgb(66, 66, 66);
}
</style>