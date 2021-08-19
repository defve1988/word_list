<template>
  <v-container>
    <ControlBar />
    <WordTableList v-if="app_data.word_table_view=='list'" />
    <WordTableGrid v-if="app_data.word_table_view=='grid'" />
    <WordTableCard v-if="app_data.word_table_view=='flash_card'" />
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
