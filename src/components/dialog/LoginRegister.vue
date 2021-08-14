<template>
  <v-dialog v-model="app_data.register_dialog" width="500">
    <v-tabs v-model="tab">
      <v-tab>Login</v-tab>
      <v-tab>Register</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card class="pa-5" :loading="isLoading">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="Email"
            required
            prepend-icon="mdi-email"
          ></v-text-field>

          <v-text-field
            v-model="pwd"
            label="Password"
            prepend-icon="mdi-key"
            required
          ></v-text-field>

          <v-card-actions align-self="end">
            <v-spacer></v-spacer>
            <v-btn color="primary" class="mr-2" @click="login('email')">
              Login
            </v-btn>
            <v-btn color="success" @click="login('google')">
              Use google account
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card class="pa-5" :loading="isLoading">
          <v-text-field
            v-model="username"
            label="User"
            required
            prepend-icon="mdi-account"
          ></v-text-field>

          <v-text-field
            v-model="invitation"
            label="Invitation Code"
            required
            prepend-icon="mdi-heart"
          ></v-text-field>

          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="Email"
            required
            prepend-icon="mdi-email"
          ></v-text-field>

          <v-text-field
            v-model="pwd"
            label="Password"
            prepend-icon="mdi-key"
            required
          ></v-text-field>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" class="mr-2" @click="register('email')">
              Register
            </v-btn>
            <v-btn color="success" @click="register('google')">
              Use google account
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data: () => ({
    isLoading: false,
    tab: null,
    invitation: "",
    email: "",
    pwd: "",
    username: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
  },
  methods: {
    ...mapMutations([]),
    async register(RegisterType) {
      this.isLoading = true;
      let new_user = {
        email: this.email,
        pwd: this.pwd,
        username: this.username,
        RegisterType: RegisterType,
        loginType: RegisterType,
        invitationCode: this.invitation,
      };
      let res = await this.app_data.user.auth.register(new_user);
      await this.app_data.user.init_user_db()
      this.isLoading = false;
      if (res == "registered") this.app_data.register_dialog = false;
    },
    async login(loginType) {
      this.isLoading = true;
      let new_user = {
        loginType: loginType,
        email: this.email,
        pwd: this.pwd,
      };
      let res = await this.app_data.user.auth.login(new_user);
      this.isLoading = false;
      if (res == "login") this.app_data.register_dialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>