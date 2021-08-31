<template>
  <v-app>
    <v-app-bar app color="primary" dark clipped-left flat loading>
      <v-app-bar-nav-icon
        @click="app_data.mini_drawer = !app_data.mini_drawer"
      ></v-app-bar-nav-icon>
      <div
        class="app_title mx-2 pt-2"
        @click="route_home"
        style="cursor: pointer"
      >
        Word Lists
      </div>
      <v-progress-circular
        v-if="app_data.isloading"
        class="app_title mx-3 mt-4"
        :size="30"
        indeterminate
        color="secondary"
      ></v-progress-circular>

      <v-spacer></v-spacer>
      <Account />
    </v-app-bar>
    <NavBar />

    <v-main :style="`background-color:${app_data.theme_color.app_bg}`">
      <router-view />
    </v-main>
    <LoginRegister />
    <SelectLanguage />
    <ContentMenu />
    <Notes />
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import utilities from "@/app_class/utilities";

export default {
  name: "App",
  data: () => ({
    //
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    islogin() {
      return this.app_data.user.isLogin();
    },
  },

  async mounted() {
    await this.SET_THEME();
  },

  // async mounted() {
  //   this.app_data.isloading = true;
  //   // this.app_data.user = new User();
  //   this.app_data.isloading = false;
  // },
  methods: {
    ...mapMutations(["SET_THEME", "SET_QUIZ_CONFIG", "SET_LEARNING"]),
    route_home() {
      this.$router
        .replace({
          path: "/",
        })
        .catch(utilities.handle_redundant_route);
    },
  },
  watch: {
    async islogin() {
      this.app_data.isloading = true;
      if (this.app_data.user.isLogin()) {
        // if user is login, load user's theme, quiz_config, ...
        this.$router
          .replace({ path: this.app_data.login_page })
          .catch(utilities.handle_redundant_route);

        this.app_data.theme = await this.app_data.user.get_user_theme();
        this.SET_THEME();

        this.app_data.notebook_view = await this.app_data.user.get_detail(
          "notebook_view"
        );
        let quiz_config = await this.app_data.user.get_user_quiz_config();
        this.SET_QUIZ_CONFIG(quiz_config);
        let learning_config = await this.app_data.user.get_user_learning();
        this.SET_LEARNING(learning_config);
      } else {
        this.$router
          .replace({ path: "/" })
          .catch(utilities.handle_redundant_route);
      }
      this.app_data.isloading = false;
    },
  },
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Big+Shoulders+Stencil+Display");
.app_title {
  font-size: 2.5rem;
  font-family: "Big Shoulders Stencil Display", Helvetica, Arial, sans-serif;
  font-weight: medium;
}
html {
  scroll-behavior: smooth;
}
</style>