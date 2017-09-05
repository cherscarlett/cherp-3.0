<template>
    <nav role="navigation" :data-page="$route.meta.page">
        <ul class="navigation">
            <li v-for="link in links">
                <router-link
                    role="tab"
                    exact
                    :id="link.meta ? link.meta.page : 'home'"
                    :title="link.name"
                    :aria-selected="$route.path === link.path ? 'true': 'false'"
                    :to="{ path: link.path, name: link.name }">
                        {{ link.name || 'Home' }}
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
    export default {
        computed: {
            links () {
                return this.$router.options.routes
            }
        }
    }
</script>
