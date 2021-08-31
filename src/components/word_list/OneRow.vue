<template>
  <v-row class="ma-0 record-row" :style="record_row_style">
    <v-col
      cols="2"
      align-self="center"
      align="center"
      v-for="(key, index) in language_key"
      :key="index"
      class="px-0"
    >
      <OneWord
        :word="record[key]"
        :language="key"
        :id="record.id"
        :numbered="false"
      />
    </v-col>
    <!-- notes -->
    <v-col
      v-if="app_data.show_word_list_notes"
      cols="3"
      align-self="center"
      align="start"
      class="ml-1"
    >
      <pre
        class="note_tooltip body-1 font-weight-light"
        :style="`color:${app_data.theme_color.content}`"
        v-html="record.notes == '' ? empty_word : record.notes"
        @click="edit_note_at_list"
        @blur="lose_focus"
        @keydown="key_down"
        :id="`list_notes_${record.id}`"
      ></pre>
    </v-col>
    <!-- row function -->
    <v-col align-self="center">
      <v-row>
        <v-col class="mx-0 py-0" align="end">
          <template v-for="(func, index) in row_funs">
            <v-tooltip bottom :key="index">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  :color="app_data.theme_color.content"
                  :dark="app_data.theme.brightness <= 50"
                  v-if="func.class == 'heart'"
                  :class="record.favorite ? func.selected : func.class"
                  v-bind="attrs"
                  v-on="on"
                  @click="impelement_row_func(func.func)"
                >
                  <v-icon> {{ func.icon }} </v-icon>
                </v-btn>

                <v-btn
                  icon
                  :color="app_data.theme_color.content"
                  :dark="app_data.theme.brightness <= 50"
                  v-if="func.class == 'check'"
                  :class="record.mastered ? func.selected : func.class"
                  v-bind="attrs"
                  v-on="on"
                  @click="impelement_row_func(func.func)"
                >
                  <v-icon> {{ func.icon }} </v-icon>
                </v-btn>

                <v-btn
                  icon
                  :color="app_data.theme_color.content"
                  :dark="app_data.theme.brightness <= 50"
                  v-if="func.class == 'del'"
                  :class="func.class"
                  v-bind="attrs"
                  v-on="on"
                  @click="impelement_row_func(func.func)"
                >
                  <v-icon> {{ func.icon }} </v-icon>
                </v-btn>
              </template>
              <span>{{ func.tooltip }}</span>
            </v-tooltip>
          </template>
        </v-col>

        <v-col align-self="center" class="mx-0 pl-0">
          <v-progress-linear
            :value="curr_score"
            :color="bar_color"
            rounded
            height="15"
          >
            <strong class="font-weight-light caption"
              >{{ record.score == null ? 0 : Math.floor(record.score) }}/{{
                app_data.learning.learning_goal
              }}</strong
            >
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import _ from "underscore";

export default {
  name: "one_row",
  props: ["record", "row_index"],
  data: () => ({
    empty_word: "------",
    row_class: "enter_row",
    row_funs: [
      {
        icon: "mdi-heart",
        func: "add_to_like",
        tooltip: "Favorite",
        class: "heart",
        selected: "favorite",
      },
      {
        icon: "mdi-check-bold",
        func: "add_to_mastered",
        tooltip: "Marstered",
        class: "check",
        selected: "mastered",
      },
      // {
      //   icon: "mdi-label",
      //   func: "add_label",
      //   tooltip: "Add label",
      //   class: "label",
      // },
      { icon: "mdi-delete", func: "del", tooltip: "Delete", class: "del" },
    ],
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    record_row_style() {
      return {
        "--border-color": this.app_data.theme_color.content,
        "--bg-color-hover": this.app_data.theme_color.nav_bg,
      };
    },
    showned_language() {
      let res = [];
      this.app_data.user.notebooks.currNotebook.languages.forEach((lan) => {
        if (
          this.app_data.user.notebooks.currNotebook.languages_details[lan].show
        ) {
          res.push(
            this.app_data.user.notebooks.currNotebook.languages_details[lan]
          );
        }
      });
      return res;
    },
    unshowned_language() {
      let res = [];
      this.app_data.user.notebooks.currNotebook.languages.forEach((lan) => {
        if (
          !this.app_data.user.notebooks.currNotebook.languages_details[lan].show
        ) {
          res.push(
            this.app_data.user.notebooks.currNotebook.languages_details[lan]
          );
        }
      });
      return res;
    },

    language_key() {
      let res = [];
      this.app_data.user.notebooks.currNotebook.languages.forEach((lan) => {
        if (
          this.app_data.user.notebooks.currNotebook.languages_details[lan].show
        ) {
          res.push(
            this.app_data.user.notebooks.currNotebook.languages_details[lan].key
          );
        }
      });
      return res;
    },

    curr_score() {
      return (this.record.score / this.app_data.learning.learning_goal) * 100;
    },
    bar_color() {
      let color;
      switch (true) {
        case isNaN(this.curr_score) || this.curr_score == 0:
          color = "grey";
          break;
        case this.curr_score >=100:
          color = "#00E676";
          break;
        case this.curr_score >= 80:
          color = "light-green";
          break;
        case this.curr_score >= 50:
          color = "amber";
          break;
        case this.curr_score < 0:
          color = "red";
          break;
        default:
          color = "yellow";
          break;
      }
      return color;
    },
  },
  methods: {
    ...mapMutations([]),
    key_down() {},
    edit_note_at_list(event) {
      let el = event.target;
      el.setAttribute("contenteditable", true);
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
      let id = e.target.id.split("_").pop();
      let text = e.target.innerText;
      // update firebase
      if (text == this.empty_word) {
        text = "";
      }
      let word = this.app_data.user.notebooks.currNotebook.get_word(id);
      // console.log(text, word.notes);
      if (text != word.notes) {
        this.app_data.user.notebooks.currNotebook.update_record(id, {
          notes: text,
        });
      }
      // console.log(text);
    },
    async impelement_row_func(func) {
      this.app_data.word_list_loaded = true;
      switch (func) {
        case "add_to_like":
          this.app_data.user.notebooks.currNotebook
            .update_record(this.record.id, {
              favorite: !this.record.favorite,
            })
            .then((response) => {
              if (response) {
                this.record.favorite = !this.record.favorite;
              }
            });
          break;
        case "add_to_mastered":
          this.app_data.user.notebooks.currNotebook
            .update_record(this.record.id, {
              mastered: !this.record.mastered,
            })
            .then(() => {
              // this.record.mastered = !this.record.mastered;
              if (this.record.mastered) {
                var index = _.findIndex(
                  this.app_data.user.notebooks.currNotebook.word_list,
                  {
                    id: this.record.id,
                  }
                );
                console.log(index);
                this.app_data.user.notebooks.currNotebook.word_list[
                  index
                ].show = false;
              }
            });
          break;
        case "del":
          await this.app_data.user.notebooks.currNotebook.del_record(
            this.record.id
          );
          break;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.record-row {
  transition: all 0.1s;
  border-style: hidden hidden dashed hidden;
  border-width: 0.5px;
  border-color: var(--border-color);
  &:hover {
    background-color: var(--bg-color-hover);
    color: #fff;
    .heart,
    .edit_note,
    .check,
    .label {
      color: #fff;
    }
  }
  .heart {
    &:hover {
      color: #d65781 !important;
    }
  }
  .label {
    &:hover {
      color: #ff9800;
    }
  }
  .check {
    &:hover {
      color: #9f9f !important;
    }
  }
  .del {
    &:hover {
      color: #f44336 !important;
    }
  }
  .favorite {
    color: #e91e63 !important;
  }
  .mastered {
    color: #2cc026 !important;
  }
}

.note_tooltip {
  float: center;
  cursor: text;
  white-space: pre-wrap;
}
</style>