<template>
  <v-dialog v-model="app_data.notes_dialog.show" persistent max-width="300">
    <v-system-bar color="amber">
      {{ app_data.notes_dialog.word }}
    </v-system-bar>
    <v-card color="amber lighten-4" tile>
      <v-textarea
        background-color="amber lighten-4"
        class="ma-0"
        solo
        hide-details
        id="word_note_text"
        @keydown="key_down"
        autofocus
        v-model="notes"
      ></v-textarea>

      <v-btn
        color="amber darken-4"
        dark
        absolute
        bottom
        right
        fab
        x-small
        class="mb-6"
        @click="close_dialog"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import _ from "underscore";

export default {
  name: "notes",
  props: [],
  mounted() {},
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
  },
  watch: {},
  data: () => ({
    notes: "",
  }),
  methods: {
    ...mapMutations([]),
    key_down(e) {
      if (e.altKey && e.keyCode === 13) {
        this.close_dialog();
      } else if (e.keyCode === 27) {
        // esc pressed not update notes
        this.app_data.notes_dialog = {
          show: false,
          id: null,
          language: null,
          word: null,
        };
      }
    },
    close_dialog() {
      // console.log(this.notes)
      // update firebase
      this.app_data.user.notebooks.currNotebook.update_record(
        this.app_data.notes_dialog.id,
        {
          notes: this.notes,
        }
      );

      // update local
      let index = _.findIndex(
        this.app_data.user.notebooks.currNotebook.word_list,
        { id: this.app_data.notes_dialog.id }
      );

      this.app_data.user.notebooks.currNotebook.word_list[index].notes =
        this.notes;

      this.app_data.notes_dialog = {
        show: false,
        id: null,
        language: null,
        word: null,
        notes: null,
      };
    },
  },
};
</script>

<style scoped lang="scss">
</style>