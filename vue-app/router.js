import Vue from 'vue'
import Router from 'vue-router'
const Home = { template: ' ' }

Vue.use(Router)

const humanize = (string) => {
    return string.replace(/\w\S*/g, (title) => {return title.charAt(0).toUpperCase() + title.substr(1).toLowerCase()})
}

export function createRouter (pages = []) {
    const routes = pages.map((page) => {
        return {
            path: `/${page}`,
            name: humanize(page),
            component: require(`./pages/${page}/${page}.vue`),
            meta: {
                page: page
            }
        }
    }, [])
    return new Router({
        mode: 'history',
        base: __dirname,
        routes: [
            {
                path: '/',
                component: Home
            },
            ...routes
        ]
    })
}
