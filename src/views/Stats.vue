<template>
  <div class="about">
    <h1>This is a stats page</h1>
    <v-btn :style="styleObject" class="button"> test </v-btn>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Stats",
  data: () => ({
    //
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    styleObject: function () {
      return {
        "--color": "blue",
        "--color-hover": "red",
      };
    },
  },
  methods: {
    ...mapMutations([]),
  },
  watch: {},
};
</script>

<style lang="scss">
.button {
  color: var(--color);
}

.button:hover {
  color: var(--color-hover);
}
</style>