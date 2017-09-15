<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
            <!--<pre>{{error}}</pre>-->
        </mu-card>
        <mu-card class="loading" v-else-if="loadingmap || loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="lives&&maps" style="padding: 15px 0px">
            <!--<mu-card-header title="Myron Avatar" subTitle="sub title">-->
            <!--<mu-avatar src="/images/uicon.jpg" slot="avatar"/>-->
            <!--</mu-card-header>-->

            <mu-card-title title="Live" subTitle="被收录的live" style=""></mu-card-title>
            <mu-divider></mu-divider>
            <div>
                <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="false"
                          height="560px">
                    <mu-thead slot="header" class="tbth">
                        <mu-th class="wtcover">Cover</mu-th>
                        <mu-th class="wtmap">Map/Date</mu-th>
                        <mu-th class="wtscore">Score</mu-th>
                        <mu-th class="wtcombo">Combo  &判</mu-th>
                        <mu-th class="wtnotes">P/Grt Gd/B/M</mu-th>
                        <mu-th class="wtper">P率</mu-th>
                    </mu-thead>
                    <mu-tbody>
                        <mu-tr v-for="live,index in lives" :key="index"
                               :class="(live['live_setting_id'] && live['max_combo']==maps[live['live_setting_id']].s_rank_combo)?'live-fc':''" >
                            <mu-td @click="goto_live(live['live_setting_id'])">
                                <mu-badge class="demo-badge-content cursor-pointer" >
                                    <mu-avatar :src="getlive_iconsrc(live['live_setting_id'],live['live_track_id'])"
                                               :size="50"></mu-avatar>
                                </mu-badge>
                            </mu-td>

                            <mu-td class="cursor-pointer" @click="goto_live(live['live_setting_id'])">
                                <span style="font-size: 110%" v-if="live['live_setting_id']">{{ getmapname(live['live_setting_id'], live['is_random']) }}</span>
                                <span v-else>{{("difficulty-id: " + live['live_difficulty_id'])}}</span>
                                <br><span style="font-size: 85%">{{ live['update_time'].replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ")}}</span>
                            </mu-td>

                            <mu-td>{{live['score']}}</mu-td>
                            <mu-td >
                                {{live['max_combo']}}
                                <span v-if="live['live_setting_id']">{{live['max_combo'] == maps[live['live_setting_id']].s_rank_combo ? " FC " : '/'+(maps[live['live_setting_id']].s_rank_combo || ' - ')}}
                            </span>
                                <span v-if="live.judge_card>=0"> &{{live.judge_card}}</span>
                            </mu-td>
                            <mu-td>{{live['perfect_cnt'] + "/" + live['great_cnt']}}
                                <span style="margin-left: 10px">{{live['good_cnt'] + "/" + live['bad_cnt'] + "/" + live['miss_cnt']}}</span>
                            </mu-td>
                            <mu-td>{{getpercent(live)}}</mu-td>


                        </mu-tr>
                    </mu-tbody>
                </mu-table>
            </div>
            <mu-card-actions>
                <!--<mu-flat-button label="Action 1"/>-->
                <!--<mu-flat-button label="Action 2"/>-->
                <mu-pagination :total="count" :current="page" @pageChange="handlepage"
                               :defaultPageSize="limit">
                </mu-pagination>
            </mu-card-actions>
        </mu-card>

    </div>
</template>

<script>
    import axios from 'axios'
    import bus from '../bus.js'
    import util from '../util.js'

    export default {
        data(){
            return {
                loadingmap: true,
                loadingapi: true,
                lives: null,
                page: 1,
                limit: 15,
                count: null,
                error: null,
                maps: null

            }
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchMap()
            this.fetchData()
            bus.$on('refresh', () => {

                this.fetchData()

            })
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData'
        },

        methods: {
            goto_live(setid){
                this.$router.push({
                    path:this.$route.path,
                    query:{
                        setid:setid
                    }
                })
            },
            handlepage (newIndex) {
                this.page = newIndex
                this.fetchData(false)
                document.getElementsByClassName('mu-table')[0].parentElement.scrollTop = 0
            },
            fetchMap (reload = true){
                reload && (this.loadingmap = true);
                const vm = this;
                const map_url = util.live_map
                axios.get(map_url)
                    .then(function (response) {
                        vm.maps = response.data
                        reload && (vm.loadingmap = false);
                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err)

                    })
            },

            fetchData (reload = true) {

                reload && (this.loadingapi = true);
                const vm = this;
                axios.get(util.api_server + 'llproxy/liveInfo/', {
                    params: {
                        uid: vm.$route.params.id,
                        limit: vm.limit,
                        page: vm.page,
                        setid: vm.$route.query.setid || null
                    }
                })
                    .then(function (response) {

                        vm.lives = response.data['result']['lives'];
                        vm.page = response.data['result']['curr_page'];
                        vm.limit = response.data['result']['limit'];
                        vm.count = response.data['result']['count']
                        reload && (vm.loadingapi = false);
                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err)

                    })

            },
            getlive_iconsrc(live_id, track_id, mgd=2) {
                const hosts = util.asset_root
                if (this.maps && this.maps['' + live_id]) {

                    return hosts + this.maps['' + live_id]['live_icon_asset']
                } else if (mgd === 2 && track_id) {
                    return hosts + "assets/image/live/live_icon/j_aq_" + track_id + ".png"
                }
                return ''
            },
            getmapname(live_id, rand = false) {
                if (this.maps && this.maps['' + live_id]) {

                    const i = this.maps['' + live_id]
                    return i['name'] + (rand ? "-随机-" : '') + '/' + live_id + " [" + i['difficulty_text'] + "]"
                }
                return null
            },
            getpercent(live) {
                const p = live['perfect_cnt']
                const combo_all = live['perfect_cnt'] + live['great_cnt'] + live['good_cnt'] + live['miss_cnt'] + live['bad_cnt']
                return (Math.round(p / combo_all * 1000) / 10.0 + "%")
            }

        }
    }
</script>

<style type="less">
    .loading {
        padding: 120px;
        text-align: center;
    }

    .demo-badge-content {
        padding: 2px;
        margin-top: 10px;

        .mu-badge {
            background-color: inherit;
            color: inherit;
        }

    }

    .mu-td, .mu-th {
        padding-left: 16px;
        padding-right: 5px;
        text-align: center;
        white-space: normal;
    }

    .livetable {
        width: auto;
        text-align: center;
    }

    .live-fc {
        background-color: rgba(253, 239, 255, 0.65);
    }

    .tbth {

    }

    .wtmap {
        width: 150px;
    }

    .wtcover {
        width: 80px;
    }

    .wtcombo {
        width: 60px;
    }

    .wtnotes {
        width: 120px;
    }

    .wtper {
        width: 60px;
    }

    .wtscore {
        width: 60px;
    }
    .cursor-pointer {
        cursor: pointer;
    }
</style>