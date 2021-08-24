<template>
  <v-container>
    <v-row>
      <v-col lg="3" md="6" align="center">
        <v-hover v-slot="{ hover }">
          <v-card
            height="200"
            class="d-flex flex-column align-center justify-center lighten-2"
            :color="app_data.theme_color.card_bg"
            style="cursor: pointer"
            :elevation="hover ? 6 : 2"
            @click="new_notebook"
          >
            <v-card-text align-self="center">
              <v-icon size="80" :color="app_data.theme_color.content">
                mdi-plus
              </v-icon>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>

      <v-col lg="3" md="6" v-for="(notebook, index) in noteBooks" :key="index">
        <v-hover v-slot="{ hover }">
          <v-card
            height="200"
            :elevation="hover ? 6 : 2"
            class="d-flex flex-column align-center justify-center lighten-2"
            :color="app_data.theme_color.card_bg"
            @click="open_notebook(notebook.id)"
          >
            <v-card-text>
              <v-row class="align-center justify-center">
                  <span v-for="(lan, index) in notebook.languages" :key="index">
                    <v-img
                      max-height="15"
                      max-width="25"
                      :src="app_data.world_language[lan].flag"
                      class="mx-1"
                      style="filter: grayscale(50%)"
                    ></v-img>
                  </span>

              </v-row>
            </v-card-text>
            <v-card-title
              class="title text-uppercase"
              :style="`color:${app_data.theme_color.content}`"
              :id="'notebook_' + notebook.id"
              @blur="lose_focus"
            >
              {{ notebook.notebook_name }}
            </v-card-title>
            <v-card-actions>
              <v-btn
                icon
                @click="open_notebook(notebook.id)"
                :color="app_data.theme_color.content"
              >
                <v-icon> mdi-book-open-page-variant </v-icon>
              </v-btn>
              <v-btn
                icon
                @click="edit_notebook_name(notebook.id)"
                @click.native.stop
                :color="app_data.theme_color.content"
              >
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
              <v-btn
                icon
                @click="edit_notebook_languages(notebook.id)"
                @click.native.stop
                :color="app_data.theme_color.content"
              >
                <v-icon> mdi-translate </v-icon>
              </v-btn>
              <v-btn
                icon
                @click="del_notebook(notebook.id)"
                @click.native.stop
                :color="app_data.theme_color.content"
              >
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import utilities from "@/app_class/utilities";

export default {
  name: "notebooks",
  mounted() {},
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    noteBooks() {
      return this.app_data.notebook_info;
    },
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        ghostClass: "drag-ghost",
      };
    },
  },
  watch: {},
  data: () => ({
    editing_notebook: null, // current editing notebook name
  }),
  methods: {
    ...mapMutations([]),
    new_notebook() {
      this.app_data.new_notebook = true;
      this.app_data.update_language_notebook = "";
      this.app_data.select_language = [];
      this.app_data.select_language_dialog = true;
    },

    async open_notebook(notebook_id) {
      this.app_data.isloading = true;
      // ensure the animation is correct.
      this.app_data.word_list_loaded = false;
      this.app_data.word_list_leave = true;

      await this.app_data.user.notebooks.switch_notebook(notebook_id);
      this.app_data.word_list_leave = false;

      this.$router
        .replace({
          path: "Words",
        })
        .catch(utilities.handle_redundant_route);
      this.app_data.isloading = false;
    },

    async edit_notebook_name(notebook_id) {
      this.editing_notebook = notebook_id;
      let title = document.getElementById("notebook_" + notebook_id);
      title.setAttribute("contenteditable", true);
      this.focus_select(title);
    },

    async edit_notebook_languages(notebook_id) {
      this.app_data.update_language_notebook = notebook_id;
      // get current notebook language
      let notebooks = this.app_data.user.get_noteBooks(notebook_id);
      // console.log(notebooks);

      this.app_data.select_language = notebooks.languages;
      this.app_data.new_notebook = false;
      this.app_data.select_language_dialog = true;
    },

    async del_notebook(notebook_id) {
      await this.app_data.user.notebooks.del_notebook(notebook_id);
      this.app_data.notebook_info = this.app_data.user.get_noteBooks();
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
      this.app_data.user.notebooks.update_notebook(this.editing_notebook, {
        notebook_name: e.target.innerText,
      });
      e.target.setAttribute("contenteditable", false);
      this.editing_notebook = null;
      this.app_data.notebook_info = this.app_data.user.get_noteBooks();
    },
  },
};
</script>

<style scoped lang="scss">
</style>