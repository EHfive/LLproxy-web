<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
            <!--<pre>{{error}}</pre>-->
        </mu-card>
        <mu-card v-else-if="loadingapi || loadingmap" class="loading">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <div v-else-if="decks">
            <router-view :decks="decks" :skills="skills"></router-view>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'
    import bus from '../bus.js'
    import util from '../util.js'

    export default {
        data(){
            return {
                loadingapi: true,
                loadingmap: true,
                decks: null,
                skills: null,
                error:null

            }
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData()
            this.fetchMap()
            bus.$on('refresh', () => {

                this.fetchData()

            })
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData',
        },

        methods: {
            fetchMap (reload = true){
                reload && (this.loadingmap = true);
                const vm = this;
                const map_url = util.removable_skill_map
                axios.get(map_url)
                    .then(function (response) {
                        vm.skills = response.data
                        reload && (vm.loadingmap = false);
                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err)

                    })
            },
            fetchData (reload = true) {

                this.error = this.userinfo = null;
                reload && (this.loadingapi = true);
                // replace getPost with your data fetching util / API wrapper
                const vm = this;
                axios.get(util.api_server + 'llproxy/deckInfo/', {
                    params: {
                        uid: vm.$route.params.id,
                    }
                })
                    .then(function (response) {
                        reload && (vm.loadingapi = false);
                        vm.decks = response.data.result.deck_info;
                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err)

                    })

            },



        }
    }
</script>

<style type="less">
    .loading {
        padding: 120px;
        text-align: center;
    }

    .mu-td, .mu-th {
        padding-left: 16px;
        padding-right: 5px;

        white-space: normal;
    }

    .demo-badge-content {
        padding: 6px;
        margin-top: 10px;

        .mu-badge {
            background-color: inherit;
            color: inherit;
        }

    }

    .livetable {
        width: auto;
    }

    .wtcardpool {
        width: 20%;
    }

    .wtavatar {
        width: 40%;
    }

    .wtavatar-bypt {
        width: 50%;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }
</style>