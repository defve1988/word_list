<template>
  <v-navigation-drawer
    app
    :mini-variant="app_data.mini_drawer"
    clipped
    permanent
    width="200"
    :style="app_data.dark_theme ? 'background: #222326' : 'background: #eeee'"
  >
    <v-list-group appendIcon="" @click="click_notebook()">
      <template v-slot:activator>
        <v-list-item-icon>
          <v-icon>{{ notebook_item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="font-weight-light">{{
            notebook_item.text
          }}</v-list-item-title>
        </v-list-item-content>
      </template>
      <template v-if="!app_data.mini_drawer">
        <v-list-item
          v-for="(notebook, index) in app_data.notebook_info"
          :key="index"
          dense
          @click="open_notebook(notebook.id)"
        >
          <v-list-item-icon class="ml-5 mr-2">
            <v-icon small>mdi-notebook</v-icon>
          </v-list-item-icon>
          <v-list-item-title
            class="font-weight-light"
            v-text="notebook.notebook_name"
          ></v-list-item-title>
        </v-list-item>
      </template>
    </v-list-group>

    <v-list class="pt-0">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        @click="nav_func(item.func)"
        :to="item.router == '' ? null : { name: item.router }"
      >
        <v-divider v-if="item.icon == 'divider'"></v-divider>

        <v-list-item-icon v-if="item.icon != 'divider'">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content v-if="item.icon != 'divider'">
          <v-list-item-title class="font-weight-light">{{
            item.text
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import utilities from "@/app_class/utilities";

export default {
  data: () => ({
    notebook_item: {
      icon: "mdi-notebook-multiple",
      text: "NoteBooks",
      func: "notebook",
      router: "Notebooks",
    },
    items: [
      {
        icon: "mdi-progress-question",
        text: "Quizzes",
        func: "quiz",
        router: "Quiz",
      },
      {
        icon: "mdi-chart-bar",
        text: "Statistics",
        func: "stats",
        router: "Stats",
      },
      { icon: "mdi-information", text: "About", func: "test", router: "About" },
      // { icon: "mdi-translate", text: "Languages", func: "" },
      { icon: "divider", text: "", func: "", router: "" },
      { icon: "mdi-logout", text: "Logout", func: "logout", router: "" },
    ],
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
  },
  methods: {
    ...mapMutations(["LOGOUT"]),
    click_notebook() {
      this.app_data.mini_drawer = false;
      this.nav_func("notebook");
    },
    log(e) {
      console.log(e);
    },
    nav_func(func) {
      switch (func) {
        case "notebook":
          this.$router
            .replace({
              path: "Notebooks",
            })
            .catch(utilities.handle_redundant_route);
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    logout() {
      this.app_data.user.auth.logout();
      this.$router
        .replace({
          path: "",
        })
        .catch(utilities.handle_redundant_route);
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
  },
};
</script>

<style lang="scss" scoped>
</style>