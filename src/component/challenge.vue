<template>
    <div>
        <mu-card class="loading" v-if="loadingmap || loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>

        <mu-card v-else-if="lives&&maps" style="padding: 0px 0px">
            <!--<mu-card-header title="Myron Avatar" subTitle="sub title">-->
            <!--<mu-avatar src="/images/uicon.jpg" slot="avatar"/>-->
            <!--</mu-card-header>-->
            <mu-tabs :value="activeTab" @change="handleTabChange">
                <mu-tab value="tab1" title="Challenge Fes 记录"/>
                <mu-tab value="tab2" title="统计"/>
            </mu-tabs>
            <mu-content-block style="margin-left: 10px">

                <mu-select-field v-model="sltevent" label="选择活动" style="margin-right: 15px">
                    <mu-menu-item v-for="vals,index in eventlist" :key="index" :value="vals.event_id"
                                  :title="vals.title+' /'+vals.event_id"
                    ></mu-menu-item>
                </mu-select-field>
                <!--<mu-switch  label="显示非活动曲" v-model="shownormal" labelLeft=""></mu-switch>-->
            </mu-content-block>
            <div v-if="activeTab === 'tab2' && eventview">
                <mu-card-text>
                    <mu-flexbox>
                        <mu-flexbox-item class="flex-demo">
                            获得 LP :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{eventview.total_lp_gain}}
                        </mu-flexbox-item>

                        <mu-flexbox-item class="flex-demo">
                            获得 招募券 :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{eventview.total_ticket_gain}}
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">

                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">

                        </mu-flexbox-item>
                    </mu-flexbox>
                    <br>
                    <mu-flexbox>
                        <mu-flexbox-item class="flex-demo">
                            <!--<img src="" alt="金箱">-->
                            金箱 :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{eventview.rarity_3_cnt}}
                        </mu-flexbox-item>

                        <mu-flexbox-item>
                            <!--<img src="" alt="银箱">-->
                            银箱 :
                        </mu-flexbox-item>

                        <mu-flexbox-item>
                            {{eventview.rarity_2_cnt}}
                        </mu-flexbox-item>
                        <mu-flexbox-item>
                            <!--<img src="" alt="铜箱">-->
                            铜箱 :
                        </mu-flexbox-item>

                        <mu-flexbox-item>
                            {{eventview.rarity_1_cnt}}
                        </mu-flexbox-item>
                    </mu-flexbox>
                    <br>
                    <mu-flexbox>
                        <mu-flexbox-item class="flex-demo">
                            <!--<img src="" alt="最高分">-->
                            High Score :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{eventview.high_score}}
                        </mu-flexbox-item>

                        <mu-flexbox-item>
                            <!--<img src="" alt="活动pt">-->
                            活动pt :
                        </mu-flexbox-item>

                        <mu-flexbox-item>
                            {{eventview.total_event_point}}
                        </mu-flexbox-item>
                        <mu-flexbox-item>
                            <!--<img src="" alt="Round">-->
                            Round :
                        </mu-flexbox-item>

                        <mu-flexbox-item>
                            {{eventview.total_rounds}}
                        </mu-flexbox-item>
                    </mu-flexbox>
                </mu-card-text>
                <mu-card-title title="Combo pt加成系数" subTitle="加权平均计算" style=""></mu-card-title>
                <mu-card-text>
                    <mu-flexbox>
                        <mu-flexbox-item class="flex-demo">
                            加权平均 总 Combo加成 (超级) :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            x <span style="font-size: medium">{{eventview.combo_multiple}}</span>
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                        </mu-flexbox-item>

                    </mu-flexbox>
                    <mu-table>
                        <mu-thead slot="header">

                            <mu-th style="text-align: left" v-for="n in 1,5" :key="n">Round. {{n}}</mu-th>
                        </mu-thead>
                        <mu-tbody>
                            <mu-td style="text-align: left" v-for="v,k in eventview.combo_multiple_r" :key="k">x <span style="font-size: small">{{v}}</span></mu-td>
                        </mu-tbody>
                    </mu-table>
                </mu-card-text>

                <br>
            </div>
            <div v-if="activeTab === 'tab1'">
                <div>
                    <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="false"
                              height="560px">
                        <mu-thead slot="header" class="tbth">
                            <mu-th class="wtround">序号-轮数</mu-th>
                            <mu-th class="wtcover">获得pt</mu-th>
                            <mu-th class="wtmap">Map/Date</mu-th>
                            <mu-th class="wtscore">Score</mu-th>
                            <mu-th class="wtcombo">Combo</mu-th>
                            <mu-th class="wtnotes">Perfect/Great Good/Bad/Miss</mu-th>
                            <mu-th class="wtper">P率</mu-th>
                        </mu-thead>
                        <mu-tbody>
                            <mu-tr v-for="live,index in lives" :key="index"
                                   :class="(live['max_combo']==maps[live['live_setting_id']].s_rank_combo?'live-fc':'')">
                                <mu-td style="font-size: 125%">
                                    {{live['pair_id']}}-{{live['round']}}
                                </mu-td>
                                <mu-td>
                                    {{live['event_point']}} pt
                                </mu-td>

                                <mu-td class="cursor-pointer" @click="goto_live(live['event_id'])">
                                    {{ getmapname(live['live_setting_id'], live['is_random']) || ("difficulty-id: " + live['live_difficulty_id'])}}
                                    <br><span
                                        style="font-size: 85%">{{ live['update_time'].replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ")}}</span>
                                </mu-td>

                                <mu-td>{{live['score']}}</mu-td>
                                <mu-td>
                                    {{live['max_combo']}}/{{live['max_combo'] == maps[live['live_setting_id']].s_rank_combo ? "[ FC ]" : (maps[live['live_setting_id']].s_rank_combo || ' - ')}}
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
            </div>
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
                limit: 10,
                count: null,
                error: null,
                maps: null,
                sltevent: 0,
                activeTab: 'tab1',
                eventview: null,
                eventlist: [
                    {
                        event_id: 76,
                        title: "第三次 Challenge Festival",
                        begin: {
                            "time": "2017-06-26 15:00:00",
                            "timestamp": 1498460400
                        },
                        end: {
                            "time": "2017-07-06 14:00:00",
                            "timestamp": 1499320800
                        },
                        type: 4
                    }
                ]

            }
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchMap()
            for (const x in this.eventlist) {

                if (Date.now() / 1000 >= (this.eventlist[x].begin.timestamp )) {
                    this.sltevent = this.eventlist[x].event_id;
                }
                break
            }
            this.fetchData()
            bus.$on('refresh', () => {

                this.fetchData()

            })

        },

        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData',
            'shownormal': 'changept',
            'sltevent': 'changept'
        },

        methods: {
            changept(){
                this.page = 1
                this.fetchData(false)
            },
            handleTabChange (val) {
                this.activeTab = val
            },
            handleActive () {
                window.alert('tab active')
            },
            goto_live(eventid){
                this.$router.push({
                    path: this.$route.path,
                    query: {
                        eventid: eventid
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
                        vm.error = err.toString();
                        console.log(err)

                    })
            },

            fetchData (reload = true) {

                reload && (this.loadingapi = true);
                const vm = this;
                axios.get(util.api_server + 'llproxy/eventChallenge/', {
                    params: {
                        uid: vm.$route.params.id,
                        limit: vm.limit,
                        page: vm.page,
                        eventid: vm.sltevent || vm.$route.query.eventid || null,
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
                        vm.error = err.toString();
                        console.log(err)

                    })
                axios.get(util.api_server + 'llproxy/eventChallengeView/', {
                    params: {
                        uid: vm.$route.params.id,
                        eventid: vm.$route.query.eventid || vm.sltevent || null,
                    }
                })
                    .then(function (response) {

                        vm.eventview = response.data.result;
                        console.log(response.data.result);
                        reload && (vm.loadingapi = false);
                    })
                    .catch(function (err) {
                        vm.error = err.toString();
                        console.log(err)

                    })

            },
            getlive_iconsrc(live_id, track_id, mgd = 2) {
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
                    return i['name'] + (rand ? "-随机-" : '') + " [" + i['difficulty_text'] + "]"
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
        padding: 6px;
        margin-top: 10px;

        .mu-badge {
            background-color: inherit;
            color: inherit;
        }

    }

    .mu-td, .mu-th {
        padding-left: 16px;
        padding-right: 5px;
        height: 75px;
        white-space: normal;
    }

    .livetable {
        width: auto;
    }

    .live-fc {
        background-color: rgba(253, 239, 255, 0.65);
    }

    .live-event {
        color: #1e88e5;
    }

    .tbth {

    }

    .wtmap {
        width: 150px;
    }

    .wtcover {
        width: 50px;
    }

    .wtround {
        width: 40px;
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