<template>
  <v-container class="px-10">
    <v-row>
      <v-col class="title">
        <h2 :style="`color:${app_data.theme_color.content}`">APP Settings</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <h3 :style="`color:${app_data.theme_color.content}`">
          Update your database
        </h3>
        <div :style="`color:${app_data.theme_color.content}`">
          The database structure would be changed with the releasing of new
          versions. Make sure your database structure is up-to-date.
        </div>
        <v-btn
          small
          class="mt-2 mr-2"
          :dark="!app_data.theme.dark"
          @click="check_user_db"
        >
          Check
        </v-btn>
        <v-btn
          small
          class="mt-2"
          :dark="!app_data.theme.dark"
          @click="update_user_db"
          :loading="update_progress"
        >
          Update
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-divider
        :style="`border-color:${app_data.theme_color.content}`"
      ></v-divider>
    </v-row>
    <v-row>
      <v-col>
        <h3 :style="`color:${app_data.theme_color.content}`">NoteBook</h3>
        <v-switch
          @click="change_notebook_view"
          :label="app_data.notebook_view == 'card' ? 'Card View' : 'List View'"
          :dark="app_data.theme.brightness <= 50"
          inset
        ></v-switch>
      </v-col>
    </v-row>

    <v-row>
      <v-divider
        :style="`border-color:${app_data.theme_color.content}`"
      ></v-divider>
    </v-row>

    <v-row>
      <v-col>
        <h3 :style="`color:${app_data.theme_color.content}`">
          APP Theme
          <v-btn
            small
            :dark="!app_data.theme.dark"
            @click="save_theme"
            class="mx-5"
          >
            Save current theme
          </v-btn>
        </h3>

        <v-checkbox
          v-model="app_data.theme.dark"
          @click="change_theme"
          label="Dark Theme"
          :dark="app_data.theme.brightness <= 50"
        ></v-checkbox>
      </v-col>
    </v-row>

    <v-row>
      <v-col lg="5" md="4">
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

      <v-col lg="5" md="4">
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

    <v-row>
      <v-divider
        :style="`border-color:${app_data.theme_color.content}`"
      ></v-divider>
    </v-row>

    <v-row>
      <v-col>
        <h3 :style="`color:${app_data.theme_color.content}`">
          Learning Goals
          <v-btn
            class="mx-5"
            small
            :dark="!app_data.theme.dark"
            @click="save_learning_goal"
          >
            Update learning goal
          </v-btn>
        </h3>

        <v-row>
          <v-col lg="8" md="12">
            <v-card
              :dark="!app_data.theme.dark"
              flat
              :color="app_data.theme_color.app_bg"
            >
              <template v-for="(item, index) in learning_config">
                <v-subheader
                  class="px-2"
                  :key="index"
                  :style="`color:${app_data.theme_color.content}`"
                >
                  {{ item.label }}: {{ app_data.learning[item.val] }}
                </v-subheader>
                <v-subheader
                  class="px-2"
                  :key="index + 'hint'"
                  :style="`color:${app_data.theme_color.content}`"
                >
                  {{ item.hint }}
                </v-subheader>

                <v-slider
                  :key="index + 'slider'"
                  v-model="app_data.learning[item.val]"
                  @change="onChange()"
                  :max="item.max"
                  :min="item.min"
                  :dark="app_data.theme.brightness <= 50"
                  :color="app_data.theme_color.content"
                ></v-slider>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

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
    learning_config: [
      {
        label: "Goal",
        val: "learning_goal",
        max: 50,
        min: 10,
        hint: "Score to master a word. When the goal score is reached, the word will be set as mastered. Mannually mastered word will get 90% of this score.",
      },
      {
        label: "Excellent Score",
        val: "learning_excellent_scores",
        max: 10,
        min: 1,
        hint: "Score from an 'Excellent' response, spell quiz will tripple this score.",
      },
      {
        label: "Nice Score",
        val: "learning_nice_scores",
        max: 10,
        min: 1,
        hint: "Score from a 'Nice' response, spell quiz will tripple this score.",
      },
      {
        label: "OK Score",
        val: "learning_ok_scores",
        max: 10,
        min: 1,
        hint: "Score from an 'OK' response, spell quiz will tripple this score.",
      },
      {
        label: "Correct Score",
        val: "learning_correct_score",
        max: 10,
        min: 1,
        hint: "Score from a 'Correct' response, spell quiz will tripple this score.",
      },
      {
        label: "Error Score",
        val: "learning_error_score",
        max: 0,
        min: -10,
        hint: "Score from a 'Error' response.",
      },
      {
        label: "Excellent Chain Reward",
        val: "learning_excellent_chain_award",
        max: 5,
        min: 2,
        hint: "An additional excellent score will be added if you reach the excellent chain number.",
      },
      {
        label: "Nice Chain Reward",
        val: "learning_nice_chain_award",
        max: 5,
        min: 2,
        hint: "An additional nice score will be added if you reach the nice chain number.",
      },
      {
        label: "Time Effect (days)",
        val: "learning_time_award_effected",
        max: 10,
        min: 1,
        hint: "Time multiplier will be set into action when the word was tested several days ago. A multiplier (1+log(days)) will be applied for both positive and negative score.",
      },
    ],
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    update_progress() {
      return this.app_data.firestore_db.progressing;
    },
  },
  methods: {
    ...mapMutations(["SET_THEME"]),
    ...mapActions(["CHECK_DB", "UPDATE_DB"]),
    check_user_db() {
      this.CHECK_DB();
    },
    async save_theme() {
      await this.app_data.user.set_user_theme(this.app_data.theme);
      alert("User's theme updated.");
    },
    async save_learning_goal() {
      await this.app_data.user.set_detail(this.app_data.learning);
      alert("Learning goal updated.");
    },
    update_user_db() {
      this.UPDATE_DB();
    },
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
      this.app_data.user.set_detail({
        notebook_view: this.app_data.notebook_view,
      });
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
// .v-divider {
//   border-color: rgba(0, 0, 0, 0.12) !important;
// }
</style>