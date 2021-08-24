<template>
  <v-container>
    <v-row>
      <v-col>
        <span class="overline mx-5" :style="`color:${app_data.theme_color.content}`">
          Notebook: {{ app_data.user.notebooks.currNotebook.notebook_name }}
        </span>
      </v-col>
    </v-row>
    <ControlBar />
    <WordTableList v-if="app_data.word_table_view == 'list'" />
    <WordTableGrid v-if="app_data.word_table_view == 'grid'" />
    <WordTableCard v-if="app_data.word_table_view == 'flash_card'" />
    <v-row v-if="app_data.word_table_view == 'grid'">
      <v-spacer> </v-spacer>
      <v-col class="mr-10" cols="2">
        <pre
          class="overline"
          style="text-align: start"
          :style="`color:${app_data.theme_color.content}`"
        >
          Shuffle: Enter
    </pre
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Words",
  data: () => ({
    word: "apple",
    language: "en",
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
  },
  methods: {
    ...mapMutations([]),
  },
};
</script>
