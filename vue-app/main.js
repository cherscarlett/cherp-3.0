import Vue from 'vue'
import App from './pages/index.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

export function createApp (pages = []) {
    const router = createRouter(pages)
    const store = createStore()

    sync(store, router)

    const app = new Vue({
        router,
        store,
        render: h => h(App)
    })
    return { app, router, store }
}
