<template>
  <v-navigation-drawer
    app
    :mini-variant="app_data.mini_drawer"
    clipped
    permanent
    width="200"
    style="background: #eeee"
  >
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        @click="nav_func(item.func)"
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
    drawer: true,
    items: [
      { icon: "mdi-notebook-multiple", text: "NoteBooks", func: "notebook" },
      { icon: "mdi-progress-question", text: "Quizzes", func: "quiz" },
      { icon: "mdi-chart-bar", text: "Statistics", func: "stats" },
      { icon: "mdi-information", text: "About", func: "test" },
      // { icon: "mdi-translate", text: "Languages", func: "" },
      { icon: "divider", text: "", func: "" },
      { icon: "mdi-logout", text: "Logout", func: "logout" },
    ],
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
  },
  methods: {
    ...mapMutations(["LOGOUT"]),
    nav_func(func) {
      switch (func) {
        case "notebook":
          this.$router.replace({
            path: "Notebooks",
          }).catch(utilities.handle_redundant_route);
          break;
        case "quiz":
          this.$router.replace({
            path: "Quiz",
          }).catch(utilities.handle_redundant_route);
          break;
        case "stats":
          this.$router.replace({
            path: "Stats",
          }).catch(utilities.handle_redundant_route);
          break;
        case "test":
          if (this.app_data.dev_test) {
            this.$router.replace({
              path: "develop_test",
            }).catch(utilities.handle_redundant_route);
          } else {
            this.$router.replace({
              path: "About",
            }).catch(utilities.handle_redundant_route);
          }
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    logout() {
      this.app_data.user.auth.logout();
      this.$router.replace({
        path: "",
      }).catch(utilities.handle_redundant_route);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>