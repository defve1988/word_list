<template>
  <v-app style="background: #eeee">
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

    <v-main>
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
      return this.app_data.user.isLogin()
    },
  },
  // async mounted() {
  //   this.app_data.isloading = true;
  //   // this.app_data.user = new User();
  //   this.app_data.isloading = false;
  // },
  methods: {
    ...mapMutations([]),
    route_home() {
      this.$router
        .replace({
          path: "/",
        })
        .catch(utilities.handle_redundant_route);
    },
  },
  watch: {
    islogin() {
      if (this.app_data.user.isLogin()) {
        this.$router
          .replace({ path: "Notebooks" })
          .catch(utilities.handle_redundant_route);
      } else {
        this.$router
          .replace({ path: "/" })
          .catch(utilities.handle_redundant_route);
      }
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
</style>