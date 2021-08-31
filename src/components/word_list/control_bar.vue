<template>
  <v-container>
    <template v-for="(btn, index) of buttons">
      <v-menu
        offset-y
        :key="index"
        v-if="btn.text == 'filter'"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mx-1"
            outlined
            elevation="1"
            dense
            small
            v-bind="attrs"
            v-on="on"
            :color="app_data.theme_color.content"
            :dark="app_data.theme.brightness <= 50"
          >
            {{ btn.text }}
            <v-icon class="pl-2" small>
              {{ btn.icon }}
            </v-icon>
          </v-btn>
        </template>

        <v-list :dark="app_data.theme.brightness <= 50">
          <v-list-item-group>
            <v-list-item v-for="(item, index) in filters" :key="index" dense>
              <v-list-item-action class="mr-2">
                <v-checkbox
                  v-model="item.selected"
                  @click="filter_list(item)"
                ></v-checkbox>
              </v-list-item-action>

              <v-list-item-title
                :style="`color:${app_data.theme_color.content}`"
                >{{ item.title }}</v-list-item-title
              >
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>

      <v-menu
        offset-y
        :key="index"
        v-else-if="btn.text == 'sort'"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mx-1"
            outlined
            elevation="1"
            dense
            small
            v-bind="attrs"
            v-on="on"
            :color="app_data.theme_color.content"
            :dark="app_data.theme.brightness <= 50"
          >
            {{ btn.text }}
            <v-icon class="pl-2" small>
              {{ btn.icon }}
            </v-icon>
          </v-btn>
        </template>
        <v-list :dark="app_data.theme.brightness <= 50">
          <v-list-item-group>
            <v-list-item
              v-for="(item, index) in sorts"
              :key="index"
              dense
              @click="sort_list(item)"
            >
              <v-icon class="mr-2" :color="app_data.theme_color.content">
                {{ item.ascending ? item.icons[0] : item.icons[1] }}
              </v-icon>

              <v-list-item-title
                :style="`color:${app_data.theme_color.content}`"
                >{{ item.title }}</v-list-item-title
              >
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>

      <v-btn
        v-else
        :key="index"
        class="mx-1"
        outlined
        elevation="1"
        dense
        small
        @click="run_func(btn.func)"
                    :color="app_data.theme_color.content"
            :dark="app_data.theme.brightness <= 50"
      >
        {{ btn.text }}
        <v-icon class="pl-2" small>
          {{ btn.icon }}
        </v-icon>
      </v-btn>
    </template>

    <NewWord v-if="app_data.word_table_view == 'list'" />
    <CardConfig v-if="app_data.word_table_view == 'flash_card'" />
    <CardConfig v-if="app_data.word_table_view == 'grid'" />
    <v-file-input
      id="file-input"
      type="file"
      name="name"
      accept=".csv"
      style="display: none"
      @change="file_load"
    >
    </v-file-input>
  </v-container>
</template>

<script>
import utilities from "@/app_class/utilities";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Words",
  mounted() {
    document.addEventListener("keypress", this.key_pressed);
  },
  data: () => ({
    buttons: [
      {
        text: "list view",
        icon: "mdi-format-list-bulleted-square",
        func: "list_view",
      },
      { text: "grid view", icon: "mdi-grid", func: "gird_view" },
      { text: "flash card", icon: "mdi-card-outline", func: "flash_card" },
      { text: "sort", icon: "mdi-sort", func: "sort" },
      { text: "filter", icon: "mdi-filter-menu", func: "filter" },
      { text: "upload", icon: "mdi-cloud-upload", func: "upload" },
      { text: "export", icon: "mdi-cloud-download", func: "export" },
    ],
    filters: [
      { title: "Favorite", selected: false },
      { title: "Mastered", selected: false },
      { title: "Notes", selected: true },
    ],
    sorts: [
      {
        title: "Random",
        ascending: true,
        icons: ["mdi-shuffle-variant", "mdi-shuffle-variant"],
      },
      {
        title: "Alphabet",
        ascending: true,
        icons: [
          "mdi-sort-alphabetical-ascending",
          "mdi-sort-alphabetical-descending",
        ],
      },
      {
        title: "Date",
        ascending: true,
        icons: ["mdi-sort-calendar-ascending", "mdi-sort-calendar-descending"],
      },
      {
        title: "Score",
        ascending: true,
        icons: ["mdi-sort-ascending", "mdi-sort-descending"],
      },
      {
        title: "Type",
        ascending: false,
        icons: ["mdi-sort-bool-ascending", "mdi-sort-bool-descending"],
      },
    ],
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
  },
  methods: {
    ...mapMutations([]),
    key_pressed(e) {
      // console.log(e.keyCode);
      if (e.keyCode == 13 && this.app_data.word_table_view == "grid")
        this.sort_list({ title: "Random", ascending: true });
    },
    filter_list(item) {
      this.app_data.word_list_loaded = true;
      this.app_data.word_grid_loaded = true;
      // item.selected = !item.selected;
      if (item.title == "Notes") {
        this.app_data.show_word_list_notes =
          !this.app_data.show_word_list_notes;
      }
      this.app_data.user.notebooks.currNotebook.filter({
        favorite: this.filters[0].selected,
        mastered: this.filters[1].selected,
      });
    },
    sort_list(sort) {
      this.app_data.word_list_loaded = true;
      this.app_data.word_grid_loaded = true;
      sort.ascending = !sort.ascending;
      this.app_data.user.notebooks.currNotebook.sort(
        sort.title.toLowerCase(),
        sort.ascending
      );
    },
    async file_load(file) {
      let content = await utilities.upload_csv(file);
      content.forEach((word) => {
        console.log(word);
        this.app_data.user.notebooks.currNotebook.add_record(word);
      });
    },
    async run_func(func) {
      switch (func) {
        case "upload":
          document.getElementById("file-input").click();
          break;
        case "export":
          this.app_data.user.notebooks.currNotebook.export_notebook();
          break;
        case "gird_view":
          this.app_data.word_table_view = "grid";
          this.app_data.word_grid_loaded = false;
          break;
        case "list_view":
          this.app_data.word_table_view = "list";
          this.app_data.word_list_loaded = false;
          break;
        case "flash_card":
          this.app_data.word_table_view = "flash_card";
          this.app_data.word_list_loaded = false;
          break;
      }
    },
  },
};
</script>
