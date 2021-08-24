<template>
  <v-row class="ma-1 mb-3 row_header">
    <v-col cols="3" class="pa-0 mx-0 px-3">
      <v-combobox
        v-model="card_front"
        :items="languages"
        :item-text="lan_display"
        label="Card Front"
        :dark="app_data.theme.brightness <= 50"
        :background-color="`${app_data.theme_color.app_bg}`"
        :item-color="`${app_data.theme_color.content}`"
      ></v-combobox>
    </v-col>

    <v-col cols="3" class="pa-0 mx-0 px-3">
      <v-combobox
        v-model="card_back"
        :items="languages"
        :item-text="lan_display"
        label="Card Back"
        :style="`color:${app_data.theme_color.content}`"
        :dark="app_data.theme.brightness <= 50"
        :background-color="`${app_data.theme_color.app_bg}`"
        :item-color="`${app_data.theme_color.content}`"
      ></v-combobox>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "new_word",
  props: [],
  mounted() {},
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    languages() {
      let res = [];
      this.app_data.user.notebooks.currNotebook.languages.forEach((lan) => {
        res.push(
          this.app_data.user.notebooks.currNotebook.languages_details[lan]
        );
      });
      return res;
    },

    card_front: {
      get() {
        if (this.app_data.card_front == null) {
          return this.languages[1];
        } else {
          return this.app_data.card_front;
        }
      },
      set(val) {
        this.app_data.card_front = val;
      },
    },

    card_back: {
      get() {
        if (this.app_data.card_back == null) {
          return this.languages[0];
        } else {
          return this.app_data.card_back;
        }
      },
      set(val) {
        console.log(val);
        this.app_data.card_back = val;
      },
    },
  },
  watch: {},
  data: () => ({
    record: {},
    test: [{ x: "sd" }, { x: "s" }],
  }),
  methods: {
    ...mapMutations([]),
    lan_display: (item) => item.display,
  },
};
</script>

<style scoped lang="scss">
</style>