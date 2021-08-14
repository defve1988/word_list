<template>
  <v-container>
    <ControlBar />
    <WordTableList v-if="app_data.list_view" />
    <WordTableGrid v-else />
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
