<template>
  <v-row>
    <v-col align="end">
      <v-avatar v-if="islogin && userPhoto != null" size="40">
        <img :src="userPhoto" :alt="userName" />
      </v-avatar>

      <v-icon v-if="islogin && userPhoto == null"> mdi-account </v-icon>

      <span class="font-weight-light ma-1">
        {{ userName }}
      </span>

      <v-btn plain class="mx-1" v-if="!islogin" @click="login"> Login </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({}),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    islogin() {
      return this.app_data.user.isLogin()
    },
    userName() {
      return this.app_data.user.userName()
    },
    userPhoto() {
      return this.app_data.user.userPhoto()
    },
  },
  methods: {
    login() {
      this.app_data.register_dialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
span {
  vertical-align: bottom;
  font-variant: small-caps;
  font-size: 1.2rem;
}
</style>