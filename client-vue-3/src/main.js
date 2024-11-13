// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// app.config.globalProperties.$http = api // Vue Option API
// app.provide('$http', api) // Vue Composition API

app.use(createPinia())
app.use(router)

app.mount('#app')
