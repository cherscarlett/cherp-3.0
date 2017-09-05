<template>
    <header class="header" :data-page="$route.meta.page">
        <hgroup role="img" aria-roledescription="logo">
            <h1 class="header-title">
                {{ author.firstName }} {{ author.lastName }}
            </h1>
            <h2 class="header-subtitle">
                {{ author.jobTitle }}
            </h2>
        </hgroup>
        <navigation></navigation>
    </header>
</template>

<script>
    export default {
        components: {
            navigation: require('../navigation/navigation.vue')
        },
        computed: {
            author () {
                return this.$store.state.author
            },
            theme () {
                return this.$store.state.theme
            }
        },
        created () {
        }
    }
</script>
