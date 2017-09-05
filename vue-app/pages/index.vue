<template>
    <app>
        <keep-alive>
            <app-header></app-header>
            <router-view></router-view>
        </keep-alive>
    </app>
</template>
<script>
    export default {
        components: {
            appHeader: require('../components/header/header.vue')
        },
        computed: {
            author () {
                return this.$store.state.author
            }
        },
        created() {

        }
    }
</script>
