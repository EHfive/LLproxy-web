<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
            <!--<pre>{{error}}</pre>-->
        </mu-card>
        <mu-card class="loading" v-else-if="loadingmap || loadingapi || loadingevent || loadingview">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>

        <mu-card v-else-if="pairs&&maps" style="padding: 0px 0px">
            <!--<mu-card-header title="Myron Avatar" subTitle="sub title">-->
            <!--<mu-avatar src="/images/uicon.jpg" slot="avatar"/>-->
            <!--</mu-card-header>-->
            <mu-tabs :value="activeTab" @change="handleTabChange">
                <mu-tab value="pair" title="Challenge Fes 记录" @click="handlePair()"/>
                <mu-tab value="info" title="Live 详细" @click="handleInfo()"/>
                <mu-tab value="log" title="Round 视图" @click="handleRound()"/>
                <mu-tab value="count" title="统计" @click="handleCount()"/>
            </mu-tabs>
            <mu-content-block style="margin-left: 10px">

                <mu-select-field v-model="sltevent" label="选择活动" style="margin-right: 15px">
                    <mu-menu-item v-for="vals,index in eventlist" :key="index" :value="vals.event_id"
                                  :title="vals.title+' /'+vals.event_id"
                    ></mu-menu-item>
                </mu-select-field>

            </mu-content-block>
            <div v-if="activeTab === 'pair' && lives">
                <div>
                    <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="false"
                              height="560px">
                        <mu-thead slot="header" class="tbth">
                            <mu-th style="width: 30px">序号</mu-th>
                            <mu-th style="width: 30px">活动pt</mu-th>
                            <mu-th style="width: 200px">Maps</mu-th>
                            <mu-th style="width: 60px">Datetime</mu-th>
                        </mu-thead>
                        <mu-tbody>
                            <mu-tr v-for="pair,index in pairs" :key="index">
                                <mu-td class="cursor-pointer" style="font-size: 125%;"
                                       @click="goto_live(pair['pair_id'],null)">
                                    {{pair['pair_id']}}
                                </mu-td>
                                <mu-td>
                                    {{pair['event_point']}}
                                </mu-td>
                                <mu-td style="text-align: left">
                                    <template v-for="i in pair.curr_round">
                                        <img style="margin-right: 15px;max-width: 65px"
                                             @click="goto_live(pair['pair_id'],i)"
                                             v-show="pair.round_setids[i-1]"
                                             :src="getlive_iconsrc(pair.round_setids[i-1])"
                                             class="cursor-pointer"
                                             :key="i">
                                    </template>
                                </mu-td>
                                <mu-td style="font-size: 95%">
                                    {{timefmt(pair['update_time'])}}
                                </mu-td>
                            </mu-tr>
                        </mu-tbody>
                    </mu-table>
                </div>
                <mu-card-actions>
                    <!--<mu-flat-button label="Action 1"/>-->
                    <!--<mu-flat-button label="Action 2"/>-->
                    <mu-pagination style="margin: 10px 0" :total="count" :current="page" @pageChange="handlepage"
                                   :defaultPageSize="limit">
                    </mu-pagination>
                </mu-card-actions>
            </div>
            <div v-if="activeTab === 'count' && eventview">
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
                            获得 技能exp :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{eventview.total_exp_gain}}
                        </mu-flexbox-item>
                    </mu-flexbox>
                    <br>
                    <mu-flexbox>

                        <mu-flexbox-item class="flex-demo">
                            LIVE获得 EXP :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{eventview.total_player_exp}}
                        </mu-flexbox-item>

                        <mu-flexbox-item class="flex-demo">
                            LIVE获得 G :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{eventview.total_game_coin}}
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            箱子获得 G:
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{eventview.total_reward_coin}}
                        </mu-flexbox-item>
                    </mu-flexbox>
                    <br>
                    <mu-flexbox>
                        <mu-flexbox-item class="flex-demo">
                            BUFF消耗 G :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{eventview.total_coin_cost}}
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            平均Score :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{eventview.avg_score}}
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            平均P率 :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{ Math.round(eventview.avg_perfect_rate * 1000) / 10.0}}%
                        </mu-flexbox-item>


                    </mu-flexbox>
                    <br>
                    <mu-flexbox>
                        <mu-flexbox-item class="flex-demo">
                            组均活动pt :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{eventview.avg_pair_event_pt}}
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            场均活动pt :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{eventview.avg_round_event_pt}}
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">

                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">

                        </mu-flexbox-item>


                    </mu-flexbox>
                    <br><br>
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
                            <mu-td v-if="k!=0" style="text-align: left" v-for="v,k in eventview.combo_multiple_r" :key="k">x <span
                                    style="font-size: small">{{v}}</span></mu-td>
                        </mu-tbody>
                    </mu-table>
                </mu-card-text>

                <br>
            </div>
            <div v-if="activeTab === 'log' && lives">
                <div>
                    <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="false"
                              height="560px">
                        <mu-thead slot="header" class="tbth">
                            <mu-th class="wtround">序号-轮数</mu-th>
                            <mu-th class="wtcover">获得pt</mu-th>
                            <mu-th class="wtmap">Map/Date</mu-th>
                            <mu-th class="wtscore">Score</mu-th>
                            <mu-th class="wtcombo">Combo &判</mu-th>
                            <mu-th class="wtnotes">Perfect/Great Good/Bad/Miss</mu-th>
                            <mu-th class="wtper">P率</mu-th>
                        </mu-thead>
                        <mu-tbody>
                            <mu-tr v-for="live,index in lives" :key="index"
                                   :class="(live['max_combo']==maps[live['live_setting_id']].s_rank_combo?'live-fc':'')">
                                <mu-td style="font-size: 125%" class="cursor-pointer"
                                       @click="goto_live(live['pair_id'],live.round)">
                                    {{live['pair_id']}}-{{live['round']}}
                                </mu-td>
                                <mu-td class="cursor-pointer" @click="goto_live(live['pair_id'],live.round)">
                                    {{live['event_point']}} pt
                                </mu-td>

                                <mu-td class="cursor-pointer" @click="goto_live(live['pair_id'],live.round)">
                                    {{ getmapname(live['live_setting_id'], live['is_random']) || ("difficulty-id: " + live['live_difficulty_id'])}}
                                    <br><span
                                        style="font-size: 85%">{{ timefmt(live['update_time'])}}</span>
                                </mu-td>

                                <mu-td>{{live['score']}}</mu-td>
                                <mu-td>
                                    {{live['max_combo']}}/{{live['max_combo'] == maps[live['live_setting_id']].s_rank_combo ? "[ FC ]" : (maps[live['live_setting_id']].s_rank_combo || ' - ')}}
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
                    <mu-pagination style="margin: 10px 0" :total="round_count" :current="round_page"
                                   @pageChange="handle_round_page"
                                   :defaultPageSize="round_limit">
                    </mu-pagination>
                </mu-card-actions>
            </div>
            <mu-card-actions v-if="activeTab === 'info'&& feslive" style="margin-left: 20px">
                <mu-flat-button label="Newer" style="margin-right: 20px" @click="handleNew()"/>

                <mu-flat-button style="margin-right: 20px" label="Forward" @click="handleForward()"/>
                <mu-flat-button :label="'组 '+feslive.pair_id" @click="handleInfo()"/>
            </mu-card-actions>
            <div v-if="activeTab === 'info' && feslive">
                <mu-card-text style="padding: 0 8px;">
                    <round-shower :roundin="cround" :maps="maps" :lives="feslive.lives"
                                  :pair="feslive.pair_id+''+(cround?cround:'')"
                                  :showmax="5" :showbox="feslive.round_setids"></round-shower>

                    <mu-content-block style="padding: 10px;text-align: center">
                        <mu-row gutter="" style="margin-bottom: 15px">
                            <mu-col width="100" tablet="30" desktop="30">
                                <span style="margin-right: 20px">累计 活动pt:</span>
                                <span>{{feslive.event_point}}</span>
                            </mu-col>
                            <mu-col width="100" tablet="30" desktop="30">
                                <span style="margin-right: 20px">累计 获得LP :</span>
                                <span>{{feslive.lp_add}}</span>
                            </mu-col>
                            <mu-col width="100" tablet="30" desktop="30">
                                <span style="margin-right: 20px">累计 EXP /G :</span>
                                <span>{{feslive.player_exp}} /{{feslive.game_coin}}</span>
                            </mu-col>
                        </mu-row>
                        <mu-row gutter="">
                            <mu-col width="100" tablet="30" desktop="30">
                                <span style="margin-right: 20px">金 /银 /铜</span>
                                <span>{{feslive.rarity_3_cnt}} /{{feslive.rarity_2_cnt}} /{{feslive.rarity_1_cnt}}</span>
                            </mu-col>
                            <template v-if="feslive.reward_item_list">
                                <mu-col width="100" tablet="30" desktop="30">
                                    <span style="margin-right: 20px">{{feslive.curr_round}}轮 活动pt:</span>
                                    <span>{{feslive.added_event_point}}</span>
                                </mu-col>
                                <mu-col width="100" tablet="30" desktop="30">
                                    <span style="margin-right: 20px">{{feslive.curr_round}}轮 后总活动pt:</span>
                                    <span>{{feslive.after_event_point}}</span>
                                </mu-col>
                            </template>
                        </mu-row>
                    </mu-content-block>
                    <mu-table style="margin-top: 5px" v-if="feslive.reward_item_list">
                        <mu-tr>
                            <mu-td v-for="val,k in feslive.reward_item_list" :key="k"
                                   style="text-align: center;width: 100px">
                                <mu-badge class="demo-badge-content" circle
                                          :color="{1:'#dba44f',2:'grey400',3:'yellowA700'}[val.rarity]"
                                          :content="''+{1:'铜',2:'银',3:'金'}[val.rarity]">

                                    <mu-avatar v-if="val.type==1001" :size="60"
                                               :src="val.asset?raw_file(val.asset):getavatarsrc(val.item_id)"></mu-avatar>
                                    <template v-else-if="val.asset">
                                        <img :src="raw_file(val.asset)" alt="" class="img-responsive">
                                    </template>
                                </mu-badge>
                                <span v-if="val.amount >1">x {{val.amount}}</span>
                            </mu-td>
                        </mu-tr>
                    </mu-table>
                </mu-card-text>
                <br>
            </div>
            <div v-if="activeTab === 'info' && !feslive" style="padding: 50px">
                <span v-if="pair_id >0">当前无记录号为 {{pair_id}} 的项</span>
                <span v-else>当前无记录</span>
                <br><br>
                点击 Live详细 跳至最后一次live <br>

            </div>
        </mu-card>

    </div>
</template>

<script>
    import axios from 'axios'
    import bus from '../bus.js'
    import util from '../util.js'
    import roundshower from './tiny/round-shower.vue'
    const localkey = 'challenge_tab';
    export default {
        data(){
            return {
                loadingmap: true,
                loadingapi: true,
                loadingview:true,
                loadingevent: true,
                pairs: null,
                pair_id: this.$route.query.pairid || -1,
                feslive: null,
                lives: null,
                page: 1,
                limit: 10,
                count: null,
                cround: null,
                round_page: 1,
                round_limit: 10,
                round_count: null,
                last_pair_id: 0,
                error: null,
                maps: null,
                sltevent: 0,
                activeTab: util.getkey(localkey) || 'info',
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
                    },
                    {
                        event_id: 80,
                        title: "第四次 Challenge Festival",
                        begin: {
                            "time": "2017-08-11 14:00:00",
                            "timestamp": 1502431200
                        },
                        end: {
                            "time": "2017-08-22 14:00:00",
                            "timestamp": 1503381600
                        },
                        type: 4
                    }
                ]

            }
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.loadingevent = true;
            const vm = this;

            util.eventlistPromise(4).then(function (result) {
                vm.eventlist = result.event_list;
                vm.sltevent = result.sltevent;
                vm.loadingevent=false
            }).catch(function () {
                vm.sltevent = util.selectevent(vm.eventlist);
                vm.loadingevent=false
            });
            this.fetchMap();

            bus.$on('refresh', () => {

                this.fetchData()

            })

        },

        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData',
            'shownormal': 'changept',
            'sltevent': 'changept',
            'pair_id': 'fetchLive'
        },

        methods: {
            changept(){
                this.page = 1;
                this.round_page = 1;
                this.pair_id = -1;
                this.fetchData(true);
                this.fetchRound();
                this.fetchLive();
            },
            handleTabChange (val) {
                this.activeTab = val;
                util.setkey(localkey, val)
            },
            handleActive () {
                window.alert('tab active')
            },
            handleRound(){
                this.fetchRound()
            },
            handleCount(){
                this.fetchData(false)
            },
            handlePair(){
                this.fetchData(false)
            },
            handleInfo(){
                this.pair_id = -1;
                this.fetchLive()
            },
            handleNew(){
                this.cround = null;
                if (this.pair_id === -1 || this.pair_id === this.last_pair_id) this.fetchLive();
                else {
                    if (this.feslive || this.pair_id <= this.last_pair_id) this.pair_id += 1
                    else this.pair_id = -1
                }


            },
            handleForward(){
                this.cround = null;
                if (!this.feslive && this.pair_id > this.last_pair_id) {
                    this.pair_id = -1
                    return
                }
                if (this.pair_id === -1) this.pair_id = (this.feslive.pair_id - 1) || 1;
                else {
                    if (this.pair_id >= 2) this.pair_id -= 1
                }
            },
            goto_live(pairid, cround){
                this.cround = cround
                this.pair_id = pairid

                this.activeTab = 'info'
                this.fetchLive()
            },
            handlepage (newIndex) {
                this.page = newIndex;
                this.fetchData(false);
                document.getElementsByClassName('mu-table')[0].parentElement.scrollTop = 0
            },
            handle_round_page (newIndex) {
                this.round_page = newIndex;
                this.fetchRound();
                document.getElementsByClassName('mu-table')[0].parentElement.scrollTop = 0
            },
            fetchMap (reload = true){
                reload && (this.loadingmap = true);
                const vm = this;
                const map_url = util.live_map;
                axios.get(map_url)
                    .then(function (response) {
                        vm.maps = response.data;
                        reload && (vm.loadingmap = false);
                    })
                    .catch(function (err) {
                        vm.error = err.toString();
                        console.log(err)

                    })
            },
            fetchLive(){
                const vm = this;
                axios.get(util.api_server + 'llproxy/eventChallengeLive/', {
                    params: {
                        uid: vm.$route.params.id,
                        pairid: vm.pair_id,
                        eventid: vm.$route.query.eventid || vm.sltevent || null,
                    }
                })
                    .then(function (response) {

                        vm.feslive = response.data.result;

                        if (vm.feslive && vm.pair_id === -1) vm.last_pair_id = vm.feslive.pair_id
                    })
                    .catch(function (err) {
                        vm.error = err.toString();
                        console.log(err)

                    })
            },
            fetchRound(){
                const vm = this;
                axios.get(util.api_server + 'llproxy/eventChallenge/', {
                    params: {
                        uid: vm.$route.params.id,
                        limit: vm.round_limit,
                        page: vm.round_page,
                        eventid: vm.sltevent || vm.$route.query.eventid || null,
                    }
                })
                    .then(function (response) {
                        vm.lives = response.data.result.lives;
                        vm.round_page = response.data['result']['curr_page'];
                        vm.round_limit = response.data['result']['limit'];
                        vm.round_count = response.data['result']['count']
                    })
                    .catch(function (err) {
                        vm.error = err.toString();
                        console.log(err)

                    })
            },
            fetchData (reload = true) {

                reload && (this.loadingapi = true);
                reload && (this.loadingview = true);
                const vm = this;
                axios.get(util.api_server + 'llproxy/eventChallengePairs/', {
                    params: {
                        uid: vm.$route.params.id,
                        limit: vm.limit,
                        page: vm.page,
                        eventid: vm.sltevent || vm.$route.query.eventid || null,
                    }
                })
                    .then(function (response) {

                        vm.pairs = response.data['result']['pairs'];
                        vm.page = response.data['result']['curr_page'];
                        vm.limit = response.data['result']['limit'];
                        vm.count = response.data['result']['count'];
                        vm.loadingapi = false;
                    })
                    .catch(function (err) {
                        vm.error = err.toString();
                        console.log(err)

                    });
                axios.get(util.api_server + 'llproxy/eventChallengeView/', {
                    params: {
                        uid: vm.$route.params.id,
                        eventid: vm.$route.query.eventid || vm.sltevent || null,
                    }
                })
                    .then(function (response) {

                        vm.eventview = response.data.result;
                        vm.loadingview = false;
                    })
                    .catch(function (err) {
                        vm.error = err.toString();
                        console.log(err)

                    })

            },
            getlive_iconsrc(live_id, track_id, mgd = 2) {
                const hosts = util.asset_root;
                if (this.maps && this.maps['' + live_id]) {

                    return hosts + this.maps['' + live_id]['live_icon_asset']
                } else if (mgd === 2 && track_id) {
                    return hosts + "assets/image/live/live_icon/j_aq_" + track_id + ".png"
                }
                return ''
            },
            getmapname(live_id, rand = false) {
                if (this.maps && this.maps['' + live_id]) {

                    const i = this.maps['' + live_id];
                    return i['name'] + (rand ? "-随机-" : '') + " [" + i['difficulty_text'] + "]"
                }
                return null
            },

            getpercent(live) {
                const p = live['perfect_cnt'];
                const combo_all = live['perfect_cnt'] + live['great_cnt'] + live['good_cnt'] + live['miss_cnt'] + live['bad_cnt'];
                return (Math.round(p / combo_all * 1000) / 10.0 + "%")
            },
            timefmt(isotime){
                return isotime.replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ")
            },
            getavatarsrc(unit_id) {
                if (unit_id) {
                    const urls = util.icon_root + unit_id + "/" + "0.png";
                    return urls
                } else {
                    return util.asset_root + "assets/image/ui/common/com_win_22.png"
                }
            },
            raw_file(path){
                const hosts = util.asset_root
                return hosts + path
            },
            list_or(list){
                for (var x of list) {
                    if (x) return true
                }
                return false
            }

        },
        components: {
            'round-shower': roundshower,
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
        width: 250px;
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

    .challcovers {
        text-align: left;
    }
</style>