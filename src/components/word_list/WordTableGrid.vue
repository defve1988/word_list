<template>
  <v-container fluid>
    <v-col>
      <transition-group name="list-complete" mode="out-in">
        <template
          v-for="(word, index) in app_data.user.notebooks.currNotebook
            .word_list"
        >
          <WordCard
            class="d-inline-flex ma-1 list-complete-item"
            style="flex-wrap: wrap"
            :key="word.id"
            :word="word"
            :index="index"
            v-if="word.show"
          />
        </template>
      </transition-group>
    </v-col>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "one_row",
  props: ["record", "row_index"],
  data: () => ({}),
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

<style scoped lang="scss">
.list-complete-item {
  transition: all 0.5s;
  margin-right: 10px;
}
.list-complete-enter
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(100px);
}
</style>