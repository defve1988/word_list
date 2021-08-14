import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
   theme: {
      themes: {
         light: {
            primary: '#333',
            secondary: '#9F9F9F',
            success: '#9F9F',
            accent: '#E91E63',
            error: '#F44336',
            info: '#26A69A',
            warning: '#FF9800',
            light: '#EEEEEE',
            dark: '#424242',
            background: '#424242'
         },
         dark: {
            light: '#EEEEEE',
            dark: '#424242'
         },
      },
   },
});