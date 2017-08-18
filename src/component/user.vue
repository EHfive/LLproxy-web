<template>


    <mu-row gutter>
        <mu-col desktop="30" width="100" tablet="33" class="menus">
            <menus ></menus>
        </mu-col>
        <mu-col desktop="70" width="100" tablet="65">

            <router-view ></router-view>

        </mu-col>
    </mu-row>


</template>

<script>

    import menus from './menus.vue'
    export default {
        data () {
            return {}
        },
        methods: {},
        components: {

            menus
        },
    }
</script>

<style>

    @media screen and (min-width: 1100px) {
        .menus {
            padding-right: 2%;
        }

    }

    @media screen and (min-width: 1275px) {
        .menus {
            padding-right: 2%;
        }

    }

    @media screen and (min-width: 1600px) {
        .menus {
            padding-right: 2.5%;
        }

    }
</style>
