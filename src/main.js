import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import VueHead from 'vue-head'
import router from "./router";

import App from './App.vue'

createApp(App)
	.use(VueHead)
	.use(router)
	.mount('#app')
