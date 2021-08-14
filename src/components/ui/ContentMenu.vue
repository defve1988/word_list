<template>
  <v-menu
    v-model="app_data.content_menu.show"
    :position-x="app_data.content_menu.x"
    :position-y="app_data.content_menu.y"
    absolute
    offset-y
    offset-x
  >
    <v-list>
      <v-list-item-group>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="menu_func(item.func)"
        >
          <v-icon small class="mr-1"> {{ item.mdi }} </v-icon>
          <v-list-item-title align="end">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import _ from "underscore";

export default {
  name: "content_menu",
  data: () => ({
    search_word: "https://www.google.com/search?q=define+",
    items: [
      { title: "Play Audio", mdi: "mdi-play", func: "play" },
      { title: "Edit Word", mdi: "mdi-pen", func: "edit" },
      { title: "Edit Notes", mdi: "mdi-notebook-edit", func: "notes" },
      { title: "Google Search", mdi: "mdi-google", func: "Google" },
    ],
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    showed() {
      return this.app_data.content_menu.show;
    },
  },
  watch: {
    showed() {
      if (!this.app_data.content_menu.show) {
        this.app_data.content_menu.target = { id: null };
      }
    },
  },
  methods: {
    ...mapMutations([]),
    menu_func(func) {
      switch (func) {
        case "play":
          this.app_data.content_menu.target.click();
          break;
        case "edit":
          var doubleClickEvent = document.createEvent("MouseEvents");
          doubleClickEvent.initEvent("dblclick", true, true);
          this.app_data.content_menu.target.dispatchEvent(doubleClickEvent);
          break;
        case "notes":
          var content = this.app_data.content_menu.target.id.split("_");
          var index = _.findIndex(
            this.app_data.user.notebooks.currNotebook.word_list,
            { id: content[2] }
          );

          this.app_data.notes_dialog = {
            show: true,
            id: content[2],
            language: content[1],
            word: content[0],
            notes:
              this.app_data.user.notebooks.currNotebook.word_list[index].notes,
          };
          break;
        case "Google":
          window.open(
            this.search_word + this.app_data.content_menu.target.innerText,
            "_blank"
          );
          break;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.word {
  cursor: pointer;
  font-weight: 300;
  &:hover {
    font-weight: 800;
  }
}
</style>