<template>
  <v-container>

    <NoteBookCard v-if="app_data.notebook_view=='card'" />
    <NoteBookList v-if="app_data.notebook_view=='list'" />
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "notebooks",
  mounted() {},
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
  },
  watch: {},
  methods: {
    ...mapMutations([]),
  },
};
</script>

<style scoped lang="scss">
</style>