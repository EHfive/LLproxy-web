<template>
    <div id="app">

        <headbar></headbar>
        <br>
        <div class="content">
            <mu-row gutter>
                <mu-col desktop="30" width="100" tablet="33" class="menus">
                    <menus></menus>
                </mu-col>
                <mu-col desktop="70" width="100" tablet="65">

                    <router-view></router-view>

                </mu-col>
            </mu-row>

        </div>
    </div>
</template>

<script>
    import headbar from './component/headbar.vue'
    import menus from './component/menus.vue'
    export default {
        name: 'app',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App',
            }
        },
        methods: {},
        components: {
            headbar,
            menus
        },
    }
</script>

<style>
    /*phone*/
    @media screen and (max-width:600px){

        .content {
            padding: 10px 6%
        }
    }
    /*tablet*/
    @media screen and (min-width:600px) and (max-width:1100px){
        .content {
            padding: 15px 6%
        }
    }
    /*PC*/
    @media screen and (min-width:1100px){
        .menus {
            padding-right: 2%;
        }
        .content {
            padding: 20px 14%
        }
    }
    @media screen and (min-width:1275px){
        .menus {
            padding-right: 2%;
        }
        .content {
            padding: 20px 15%
        }
    }
    @media screen and (min-width:1600px){
        .menus {
            padding-right: 2.5%;
        }
        .content {
            padding: 20px 17%
        }
    }
</style>
