<template>
  <v-container class="mt-2">
    <transition-group :name="transition_group" mode="out-in">
      <v-row
        v-for="(word, index) in app_data.user.notebooks.currNotebook.word_list"
        :key="word.id"
        :class="word_list_class"
        :style="`animation-delay:${index * delay_ratio}ms;`"
      >
        <!-- {{word.en}} -->
        <OneRow v-if="word.show" :record="word" :row_index="index" />
      </v-row>
    </transition-group>

    <!-- <v-pagination
      class="mt-5"
      v-model="page"
      :length="page_length"
      :total-visible="5"
    ></v-pagination> -->
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Words",
  data: () => ({
    delay_ratio: 20,
    page: 1,
    page_content: 10,
    count: 0,
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    transition_group(){
      let res ="list-complete"
      if (!this.app_data.word_list_loaded) res = ""
      if (this.app_data.word_list_leave) res = ""
      return res
    },
    word_list_class(){
      let res ="list-complete-item"
      if (!this.app_data.word_list_loaded) res = "enter_row"
      if (this.app_data.word_list_leave) res = "leave_row"
      // console.log(res)
      return res
    },
    // TODO: seperate pages
    page_length() {
      // .slice(
      //     page_content * (page-1),
      //     page_content * page
      //   )

      return Math.ceil(
        this.app_data.user.notebooks.currNotebook.word_list.length /
          this.page_content
      );
    },
  },
  methods: {
    ...mapMutations([]),
  },
};
</script>
<style scoped lang="scss">
@keyframes slide_in {
  from {
    transform: translateX(-500px);
    opacity: 0;
    visibility: hidden;
  }
  to {
    transform: translateX(0px);
    opacity: 1;
    visibility: visible;
  }
}

@keyframes slide_out {
  from {
    transform: translateX(0px);
    opacity: 1;
    visibility: visible;
  }
  to {
    transform: translateX(500px);
    opacity: 0;
    visibility: hidden;
  }
}

.enter_row {
  animation-name: slide_in;
  animation-duration: 600ms;
  animation-fill-mode: both;
}

.leave_row {
  animation-name: slide_out;
  animation-duration: 600ms;
  animation-fill-mode: both;
}

.list-complete-item {
  transition: all 0.5s;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-500px);
}
.list-complete-leave-active {
  position: absolute;
  transition: all 0s
}
</style>
