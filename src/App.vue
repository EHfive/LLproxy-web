<template>
    <div id="app">

        <headbar></headbar>
        <br>
        <div class="content">
            <router-view></router-view>

        </div>
    </div>
</template>

<script>
    import headbar from './component/headbar.vue'

    export default {
        name: 'app',

        data () {
            return {
                msg:"yahooooooo"
            }
        },
        methods: {},
        components: {
            headbar,

        },
    }
</script>

<style>
    /*phone*/
    .content {
        margin-left: auto;
        margin-right: auto;
        max-width: 1175px;
        padding-top: 18px;
        width: 95%;
        padding-bottom: 20px;
        height: 100%;
    }
    @media screen and (max-width: 600px) {

        .content {
            /*padding: 5px 3%*/
        }
    }

    /*tablet*/
    @media screen and (min-width: 600px) and (max-width: 1100px) {
        .content {
            /*padding: 12px 4%*/
        }
    }

    /*PC*/
    @media screen and (min-width: 1100px) {

        .content {
            /*padding: 20px 80px*/
        }
    }

    @media screen and (min-width: 1275px) {

        .content {
            /*padding: 20px 12%*/
        }
    }

</style>
