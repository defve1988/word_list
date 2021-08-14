<template>
  <v-dialog v-model="app_data.select_language_dialog" width="500" persistent>
    <v-system-bar class="primary" dark> Select languages </v-system-bar>
    <v-card :loading="isloading">
      <v-list shaped dense>
        <v-list-item-group v-model="select_language" multiple>
          <template
            v-for="(item, i) in Object.keys(app_data.world_language).sort()"
          >
            <v-list-item
              :key="`item-${i}`"
              :value="item"
              active-class="deep-purple--text text--accent-4"
            >
              <template v-slot:default="{ active }">
                <v-img
                  max-height="15"
                  max-width="25"
                  :src="app_data.world_language[item].flag"
                  class="mx-1"
                ></v-img>
                <v-list-item-content>
                  <v-list-item-title
                    class="mx-2"
                    v-text="app_data.world_language[item].display"
                  ></v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-checkbox
                    :input-value="active"
                    color="deep-purple accent-4"
                  ></v-checkbox>
                </v-list-item-action>
              </template>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          class="mr-2"
          @click="app_data.select_language_dialog = false"
        >
          Cancel
        </v-btn>
        <v-btn color="primary" class="mr-2" @click="confirm"> Confirm </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    isloading: false,
  }),
  computed: {
    ...mapState({
      app_data: "app_data",
    }),
    select_language: {
      get: function () {
        return this.app_data.select_language;
      },
      set: function (newValue) {
        this.app_data.select_language = newValue;
      },
    },
  },
  methods: {
    async confirm() {
      this.isloading = true;
      let notebook_name = "New notebook";
      if (this.app_data.user.notebooks.noteBooks.length >= 1) {
        notebook_name += this.app_data.user.notebooks.noteBooks.length;
      }
      let notebook_id;
      if (this.app_data.new_notebook) {
        await this.app_data.user.notebooks.create_notebook(
          notebook_name,
          this.select_language
        );
      } else {
        notebook_id = this.app_data.update_language_notebook;
        await this.app_data.user.notebooks.update_notebook(notebook_id, {
          languages: this.select_language,
        });
      }
      this.isloading = false;
      this.app_data.select_language_dialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>