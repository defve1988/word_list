// common
import Account from './ui/Account.vue'
import NavBar from './ui/NavBar.vue'
import ContentMenu from './ui/ContentMenu.vue'
import LoginRegister from './dialog/LoginRegister.vue'
import SelectLanguage from './dialog/SelectLanguage.vue'
import QuizConfigure from './dialog/QuizConfigure.vue'
import QuizRes from './dialog/QuizRes.vue'

import RowHeader from './word_list/RowHeader.vue'
import Notes from './word_list/Notes.vue'
import NewWord from './word_list/NewWord.vue'
import CardConfig from './word_list/CardConfig.vue'
import OneWord from './word_list/OneWord.vue'
import OneRow from './word_list/OneRow.vue'
import WordTableList from './word_list/WordTableList.vue'
import WordTableGrid from './word_list/WordTableGrid.vue'
import WordTableCard from './word_list/WordTableCard.vue'
import FlashCard from './word_list/FlashCard.vue'
import ControlBar from './word_list/control_bar.vue'
import WordCard from './word_list/WordCard.vue'


const installObj = {
  // install component
  install: function (Vue) {
    // app ui
    Vue.component('Account', Account)
    Vue.component('NavBar', NavBar)
    Vue.component('ContentMenu', ContentMenu)
    // user related
    Vue.component('LoginRegister', LoginRegister)
    Vue.component('SelectLanguage', SelectLanguage)
    Vue.component('QuizConfigure', QuizConfigure)
    Vue.component('QuizRes', QuizRes)
    // word list table
    Vue.component('RowHeader', RowHeader)
    Vue.component('NewWord', NewWord)
    Vue.component('CardConfig', CardConfig)
    Vue.component('Notes', Notes)
    Vue.component('OneWord', OneWord)
    Vue.component('OneRow', OneRow)
    Vue.component('WordTableList', WordTableList)
    Vue.component('WordTableGrid', WordTableGrid)
    Vue.component('WordTableCard', WordTableCard)
    Vue.component('FlashCard', FlashCard)
    Vue.component('ControlBar', ControlBar)
    Vue.component('WordCard', WordCard)

  }
}

// export
export default installObj