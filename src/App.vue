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
            padding-top: 1px;
            padding-bottom: 5px;
            width: 98%;
        }
    }

    /*tablet*/
    @media screen and (min-width: 600px) and (max-width: 1100px) {
        .content {
            padding-top: 3px;
            padding-bottom: 12px;
            width: 96%;
        }
    }

    /*PC*/
    @media screen and (min-width: 1100px) {

        .content {
            /*padding: 20px 80px*/
            max-width: 1200px
        }
    }

    @media screen and (min-width: 1275px) {

        .content {
            max-width: 1200px
            /*padding: 20px 12%*/
        }
    }

</style>
