<template>
  <v-container class="pa-5">
    <v-row v-for="test in account_test" :key="test.name" class="pa-1">
      <v-btn small @click="run_test(test.name, test.args)">
        {{ test.name }}
      </v-btn>
    </v-row>
    <v-divider class="my-5"></v-divider>

    <v-row v-for="test in word_list_test" :key="test.name" class="pa-1">
      <v-btn small @click="run_test(test.name, test.args)">
        {{ test.name }}
      </v-btn>
    </v-row>
    <v-divider class="my-5"></v-divider>
    <v-row class="pa-1">
      <v-btn small @click="run_TEST"> test </v-btn>
    </v-row>

    <v-row class="pa-1">
      <v-file-input @change="onFileChanged" accept=".csv"></v-file-input>
    </v-row>

    <v-row class="pa-1">
      <v-btn small @click="test_quiz"> quiz </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import _ from "underscore";

export default {
  name: "Home",
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
  },
  data: () => ({
    account_test: [
      {
        name: "test_current_user",
        args: [null],
      },
      {
        name: "test_invitation_code",
        args: ["199201", "19881218", "xcxzc", ""],
      },
      {
        name: "test_register_email",
        args: [
          {
            email: "test@gmail.com",
            pwd: "123456",
            username: "test",
            RegisterType: "email",
          },
        ],
      },
      {
        name: "test_register_google",
        args: [
          {
            email: "",
            pwd: "",
            username: "",
            RegisterType: "google",
          },
        ],
      },
      {
        name: "test_login_email",
        args: [
          {
            email: "test@gmail.com",
            pwd: "123456",
            username: "test",
            loginType: "email",
          },
        ],
      },
      {
        name: "test_login_google",
        args: [
          {
            email: "",
            pwd: "",
            username: "",
            loginType: "google",
          },
        ],
      },
      {
        name: "test_logout",
        args: [null],
      },
    ],
    word_list_test: [
      {
        name: "word_list_lan",
        args: [
          { ref: null, lan: ["Japanese", "English", "Chinese (Simplified)"] },
        ],
      },
      {
        name: "add_new_record",
        args: [
          { en: "apple", ja: "林檎", zh: "苹果" },
          { en: "potato", ja: "じゃがいも", zh: "土豆" },
        ],
      },
      {
        name: "get_list",
        args: [null],
      },
      {
        name: "duplicate_record",
        args: [
          // { en: "apple", zh: "苹果2" },
          // { en: "orange", ja: "", zh: "橙子" },
          // { en: "orange", ja: "オレンジ" },
          // { en: "test1_en", ja: "test1_ja" },
          { zh: "test1_zh", ja: "test1_ja" },
        ],
      },
      {
        name: "set_prop",
        args: [{ id: "4NvuPlVR8Z0tHZ2x8xju", prop: { favorite: true } }],
      },
    ],
  }),
  methods: {
    ...mapMutations([]),
    async run_TEST() {
      await this.app_data.test.test_init_user();
    },
    async test_quiz() {
      await this.app_data.test.test_quiz();
    },
    async onFileChanged(file) {
      await this.app_data.test.test_file(file);
    },
    async run_test(test, args) {
      _.map(args, (arg) => {
        switch (test) {
          case "test_current_user":
            this.app_data.test.test_current_user(arg);
            break;
          case "test_invitation_code":
            this.app_data.test.test_invitation_code(arg);
            break;
          case "test_register_email":
            this.app_data.test.test_register(arg);
            break;
          case "test_register_google":
            this.app_data.test.test_register(arg);
            break;
          case "test_login_email":
            this.app_data.test.test_login(arg);
            break;
          case "test_login_google":
            this.app_data.test.test_login(arg);
            break;
          case "test_logout":
            this.app_data.test.test_logout(arg);
            break;
          // --------------------
          case "word_list_lan":
            this.app_data.test.word_list_lan(arg.ref, arg.lan);
            break;
          case "add_new_record":
            this.app_data.test.add_record(arg);
            break;
          case "duplicate_record":
            this.app_data.test.add_record(arg);
            break;

          case "get_list":
            this.app_data.test.get_list(arg);
            break;

          case "set_prop":
            this.app_data.test.set_props(arg.id, arg.prop);
            break;
        }
      });
    },
  },
};
</script>
