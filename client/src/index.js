import Vue from 'vue'
import { apolloProvider } from './graphql/apollo'
import router from './router/router.js'
import App from './App.vue'
import 'normalize.css'
import '../assets/app.styl'
import { store } from './store'
import { APP_URL } from './config'

Vue.prototype.$appUrl = APP_URL

/* eslint-disable-next-line no-new */
new Vue({
  router,
  el: '#app',
  apolloProvider,
  props: [],
  data: {
    store
  },
  render: h => h(App)
})
