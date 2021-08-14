<template>
  <v-row class="ma-0 mb-3 row_header">
    <v-col
      cols="2"
      align-self="center"
      align="center"
      v-for="(language, index) in app_data.user.show_language"
      :key="language.key"
      class="px-0"
    >
      <span v-if="index == 0" style="float: left"> NO. </span>

      {{ language.display }}
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "row_header",
  props: [],
  mounted() {},
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
  },
  watch: {},
  data: () => ({}),
  methods: {
    ...mapMutations([]),
  },
};
</script>

<style scoped lang="scss">
.row_header {
  border-style: hidden hidden solid hidden;
  border-width: 3px;
  border-color: rgb(58, 58, 58);
  font-weight: 800;
}
</style>