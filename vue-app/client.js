import { createApp } from './main'
import Vue from 'vue'

Vue.mixin({
    beforeRouteUpdate (to, from, next) {
        const { asyncData } = this.$options
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to
            }).then(next).catch(next)
        } else {
            next()
        }
    }
})

const pages = window.__INITIAL_STATE__.pages
const { app, store, router } = createApp(pages)

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to)
        const prevMatched = router.getMatchedComponents(from)

        let diffed = false
        const activated = matched.filter((c, i) => {
            return diffed || (diffed = (prevMatched[i] !== c))
        })
        if (!activated.length) {
            return next()
        }
        Promise.all(activated.map(c => {
            if (c.asyncData) {
                return c.asyncData({ store, route: to })
            }
        })).then(() => {
            next()
        }).catch(next)
    })
    app.$mount('app')
    if (window.__INITIAL_STATE__) {
        const scripts = document.querySelectorAll('body script')
        scripts.forEach((script) => {
            script.parentNode.removeChild(script)
        })
    }
})
