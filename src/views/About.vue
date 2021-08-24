<template>
  <v-container class="px-10">
    <v-row>
      <v-col class="title">
        <pre class="title" :style="`color:${app_data.theme_color.content}`">
You can change app setting here.
      </pre
        >
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <span :style="`color:${app_data.theme_color.content}`"> NoteBook </span>
        <v-switch
          @click="change_notebook_view"
          :label="app_data.notebook_view == 'card' ? 'Card View' : 'List View'"
          :dark="app_data.theme.brightness <= 50"
          inset
        ></v-switch>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-checkbox
          v-model="app_data.theme.dark"
          @click="change_theme"
          label="Dark Theme"
          :dark="app_data.theme.brightness <= 50"
        ></v-checkbox>
      </v-col>
    </v-row>

    <v-row>
      <v-col lg="4" md="6">
        <v-row v-for="(item, index) in theme_color" :key="index">
          <v-col>
            <v-slider
              v-model="app_data.theme[item.val]"
              @change="onChange()"
              :label="item.label"
              max="100"
              min="0"
              thumb-label="always"
              :dark="app_data.theme.brightness <= 50"
              :color="app_data.theme_color.content"
            ></v-slider>
          </v-col>
        </v-row>
      </v-col>

      <v-col lg="4" md="6">
        <v-row>
          <v-col>
            <v-hover v-slot="{ hover }">
              <v-card
                height="200"
                :elevation="hover ? 6 : 2"
                class="d-flex flex-column align-center justify-center lighten-2"
                :color="app_data.theme_color.card_bg"
              >
                <v-card-title
                  class="title text-uppercase"
                  :style="`color:${app_data.theme_color.content}`"
                >
                  Example
                </v-card-title>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>

        <v-row>
          <v-col align="center">
            <div>
              <span
                class="word"
                :style="`color:${app_data.theme_color.content}`"
              >
                Example
              </span>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Words",
  data: () => ({
    theme_color: [
      { label: "Brightness", val: "brightness" },
      { label: "App background", val: "app_bg" },
      { label: "Nav Bar", val: "nav_bar_bg" },
      { label: "Card background", val: "card_bg" },
      { label: "Content", val: "content_color" },
    ],
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
  },
  methods: {
    ...mapMutations(["SET_THEME"]),
    async onChange() {
      // console.log(this.app_data.theme.brightness)
      await this.SET_THEME();
    },
    async change_theme() {
      if (this.app_data.theme.dark) this.app_data.theme.brightness = 10;
      if (!this.app_data.theme.dark) this.app_data.theme.brightness = 90;
      await this.SET_THEME();
    },
    change_notebook_view() {
      if (this.app_data.notebook_view == "card")
        this.app_data.notebook_view = "list";
      else if (this.app_data.notebook_view == "list")
        this.app_data.notebook_view = "card";
    },
  },
};
</script>
<style scoped lang="scss">
.word {
  cursor: pointer;
  font-weight: 300;
  float: center;
  min-height: 50px;

  &:hover {
    font-weight: 800;
    color: #9f9f !important;
  }
  &:focus {
    background-color: red;
  }
}
</style>