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
                <mu-tab value="log" title="Medley Fes 记录" @click="handleLog()"/>
                <mu-tab value="info" title="Live 详细" @click="handleInfo()"/>
                <!--<mu-tab value="combo" title="Combo" @active="handleCombo()"/>-->
                <!--<mu-tab value="count" title="统计"/>-->
            </mu-tabs>
            <mu-content-block style="margin-left: 10px">

                <mu-select-field v-model="sltevent" label="选择活动" style="margin-right: 15px">
                    <mu-menu-item v-for="vals,index in eventlist" :key="index" :value="vals.event_id"
                                  :title="vals.title+' /'+vals.event_id"
                    ></mu-menu-item>
                </mu-select-field>
                <!--<mu-switch  label="显示非活动曲" v-model="shownormal" labelLeft=""></mu-switch>-->
            </mu-content-block>
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
                            <mu-td style="text-align: left" v-for="v,k in eventview.combo_multiple_r" :key="k">x <span
                                    style="font-size: small">{{v}}</span></mu-td>
                        </mu-tbody>
                    </mu-table>
                </mu-card-text>

                <br>
            </div>
            <div v-if="activeTab === 'log'">
                <mu-card-text>
                    点击歌曲名查看详细
                </mu-card-text>
                <mu-divider></mu-divider>
                <div>
                    <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="false"
                              height="560px">
                        <mu-thead slot="header" class="tbth">
                            <mu-th class="wtround">序号</mu-th>
                            <mu-th class="wtcover">获得pt</mu-th>
                            <mu-th class="wtmap">Map/Date</mu-th>
                            <mu-th class="wtscore">Score</mu-th>
                            <mu-th class="wtcombo">Combo</mu-th>
                            <mu-th class="wtnotes">Perfect/Great Good/Bad/Miss</mu-th>
                            <mu-th class="wtper">P率</mu-th>
                        </mu-thead>
                        <mu-tbody>
                            <mu-tr v-for="live,index in lives" :key="index"
                                   :class="(live['max_combo']==live['total_combo']?'live-fc':'')">
                                <mu-td style="font-size: 125%">
                                    {{live['pair_id']}}
                                </mu-td>
                                <mu-td>
                                    {{live['added_event_point']}} pt
                                </mu-td>

                                <mu-td class="cursor-pointer" @click="goto_live(live['pair_id'])">
                                    <span v-for="ids,k in live.song_set_ids">
                                        {{ getmapname(ids, false) || ("difficulty-id: " + live.song_diff_ids[k])}}
                                        <br>
                                    </span>
                                    <span
                                            style="font-size: 85%">{{ live['update_time'].replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ")}}</span>
                                </mu-td>

                                <mu-td>{{live['score']}}</mu-td>
                                <mu-td>
                                    {{live['max_combo']}}{{live['max_combo'] == live['total_combo'] ? " FC" : '/' + (live['total_combo'] || ' - ')}}
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
            <mu-card-actions v-if="activeTab === 'info'" style="margin-left: 20px">
                <mu-flat-button label="Newer" style="margin-right: 20px" @click="handleNew()"/>
                <mu-flat-button label="Forward" @click="handleForward()"/>
            </mu-card-actions>
            <div v-if="activeTab === 'info' && feslive">

                <mu-card-text>
                    <mu-table :showCheckbox="false">
                        <mu-thead slot="header">
                            <mu-th>记录号</mu-th>
                            <mu-th>获得pt</mu-th>
                            <mu-th>Live后持有pt</mu-th>
                            <mu-th>Score</mu-th>
                            <mu-th>Combo</mu-th>
                            <mu-th>P/Great Good/B/M</mu-th>
                            <mu-th>P率</mu-th>
                        </mu-thead>
                        <mu-tbody>
                            <mu-tr
                                    :class="(feslive['max_combo']==feslive['total_combo']?'live-fc':'')">
                                <mu-td>
                                    {{feslive['pair_id']}}
                                </mu-td>
                                <mu-td>
                                    {{feslive['added_event_point']}} pt
                                </mu-td>
                                <mu-td>
                                    {{feslive['total_event_point']}} pt
                                </mu-td>
                                <mu-td>{{feslive['score']}}</mu-td>
                                <mu-td>
                                    {{feslive['max_combo']}}{{feslive['max_combo'] == feslive['total_combo'] ? " FC" : '/' + (feslive['total_combo'] || ' - ')}}
                                </mu-td>
                                <mu-td>{{feslive['perfect_cnt'] + "/" + feslive['great_cnt']}}
                                    <span style="margin-left: 10px">{{feslive['good_cnt'] + "/" + feslive['bad_cnt'] + "/" + feslive['miss_cnt']}}</span>
                                </mu-td>
                                <mu-td>{{getpercent(feslive)}}</mu-td>
                            </mu-tr>
                        </mu-tbody>
                    </mu-table>
                    <br>
                    <mu-table style="width: 100%">
                        <mu-tr>
                            <mu-td v-for="val,k in feslive.song_set_ids" :key="k" style="text-align: center">
                                <img :src="getlive_iconsrc(val)" class="img-responsive">
                            </mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td v-for="val,k in feslive.song_set_ids" :key="k" style="text-align: center">
                                {{getmapname(val, true)}}
                            </mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td v-for="val,k in feslive.song_set_ids" :key="k" style="text-align: center">
                                {{maps[val].s_rank_combo}} notes
                            </mu-td>
                        </mu-tr>
                        <mu-tr v-if="list_or(feslive.guest_bonus)">
                            <mu-td v-for="val,k in feslive.guest_bonus" :key="k" style="text-align: center">
                                <template v-if="val">
                                    {{val.user_info.name}}/{{val.user_info.user_id}}<br>
                                    {{val.description}} <span v-if="val.bonus_param != 1">x {{val.bonus_param}}</span>
                                </template>
                                <template v-else>
                                    -
                                </template>
                            </mu-td>
                        </mu-tr>
                        <!--
                        <mu-tr>
                            <mu-td v-for="val,k in feslive.guest_bonus" :key="k" style="text-align: center">
                                <template v-if="val">
                                    <img :src="raw_file(val.guest_bonus_asset)" class="img-responsive">
                                </template>
                                <template v-else>
                                    -
                                </template>
                            </mu-td>
                        </mu-tr>
                        -->

                    </mu-table>
                    <br>
                    <mu-divider></mu-divider>
                    <br>
                    <mu-table>

                        <mu-tr>
                            <mu-td v-for="val,k in feslive.festival_items" :key="k" style="text-align: center">
                                <img v-if="val.asset" :src="raw_file(val.asset)" alt="" class="img-responsive"
                                     style="max-height: 50px">
                            </mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td v-for="val,k in feslive.festival_items" :key="k" style="text-align: center">
                                {{val.desc}}
                            </mu-td>
                        </mu-tr>
                    </mu-table>
                    <mu-table>
                        <mu-tr>
                            <mu-td v-for="val,k in feslive.reward_items" :key="k" style="text-align: center">
                                <mu-badge class="demo-badge-content" circle
                                          :color="{1:'#dba44f',2:'grey400',3:'yellowA700'}[val.rarity]"
                                          :content="''+{1:'铜',2:'银',3:'金'}[val.rarity]">

                                    <mu-avatar v-if="val.type==1001" :size="60"
                                               :src="val.asset?raw_file(val.asset):getavatarsrc(val.item_id)"></mu-avatar>
                                    <template v-else-if="val.asset">
                                        <img  :src="raw_file(val.asset)" alt="" class="img-responsive">
                                    </template>
                                </mu-badge>
                                <span v-if="val.amount >1">x {{val.amount}}</span>
                            </mu-td>
                        </mu-tr>
                    </mu-table>

                </mu-card-text>
                <mu-card-text style="padding: 35px;">
                    <mu-flexbox>
                        <mu-flexbox-item class="flex-demo">
                            记录时间 :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{ feslive['update_time'].replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ")}}
                        </mu-flexbox-item>

                        <mu-flexbox-item class="flex-demo">
                            获得 绊pt :
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{feslive.love_cnt}}
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">

                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">

                        </mu-flexbox-item>
                    </mu-flexbox>
                </mu-card-text>
            </div>
            <div v-if="activeTab === 'info' && !feslive" style="padding: 50px">
                当前无记录号为 {{pair_id}} 的项 <br><br>
                点击 Live详细 或 <br>
                继续点击 Newer / Forward 跳至最后一次live <br>

            </div>
        </mu-card>

    </div>
</template>

<script>
    import axios from 'axios'
    import bus from '../bus.js'

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
                pair_id: this.$route.query.pairid || -1,
                sltevent: 0,
                feslive: null,
                activeTab: 'info',
//                activeTab: this.$route.query.pairid && this.$route.query.eventid ? 'info' : 'log',
                eventview: null,
                eventlist: [
                    {
                        event_id: 78,
                        title: "第十一次 Medley Festival",
                        begin: {
                            "time": "2017-07-11 15:00:00",
                            "timestamp": 1499756400
                        },
                        end: {
                            "time": "2017-07-20 14:00:00",
                            "timestamp": 1500530400
                        },
                        type: 3
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
            if (this.$route.query.eventid) this.sltevent = this.$route.query.eventid
            this.pair_id = -1
            this.fetchData(true)
            this.fetchLive()
            bus.$on('refresh', () => {
                this.fetchLive()
                this.fetchData(true)

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
                this.page = 1
                this.fetchData(false)
            },
            handleNew(){
                if (this.pair_id === -1) this.fetchLive();
                else {
                    if (this.feslive) this.pair_id += 1
                    else this.pair_id = -1
                }

            },
            handleForward(){
                if (!this.feslive) {
                    this.pair_id = -1
                    return
                }
                if (this.pair_id === -1) this.pair_id = this.feslive.pair_id - 1;
                else {
                    if (this.pair_id >= 2) this.pair_id -= 1
                }
            },
            handleTabChange (val) {

                this.activeTab = val

            },
            handleLog(){
                this.fetchData()
            },
            handleInfo () {
                this.pair_id = -1;
                this.fetchLive();
            },
            goto_live(pairid){
                this.pair_id = pairid
                this.activeTab = 'info'
                this.fetchLive()
            },
            handlepage (newIndex) {
                this.page = newIndex
                this.fetchData(false)
                document.getElementsByClassName('mu-table')[0].parentElement.scrollTop = 0
            },
            fetchMap (reload = true){
                reload && (this.loadingmap = true);
                const vm = this;
                const map_url = "http://cos.sokka.cn/data/json/maps_dict.min.json"
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
                axios.get('https://llsif.sokka.cn/api/llproxy/eventFestival/', {
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
                /*
                 axios.get('https://llsif.sokka.cn/api/llproxy/eventChallengeView/', {
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

                 })*/

            },
            fetchLive(){
                const vm = this;
                axios.get('https://llsif.sokka.cn/api/llproxy/eventFestivalLive/', {
                    params: {
                        uid: vm.$route.params.id,
                        pairid: vm.pair_id,
                        eventid: vm.$route.query.eventid || vm.sltevent || null,
                    }
                })
                    .then(function (response) {

                        vm.feslive = response.data.result;
                        console.log(response.data.result);
                    })
                    .catch(function (err) {
                        vm.error = err.toString();
                        console.log(err)

                    })
            },
            getlive_iconsrc(live_id, track_id, mgd = 2) {
                const hosts = "https://r.llsif.win/"
                if (this.maps && this.maps['' + live_id]) {

                    return hosts + this.maps['' + live_id]['live_icon_asset']
                } else if (mgd === 2 && track_id) {
                    return hosts + "assets/image/live/live_icon/j_aq_" + track_id + ".png"
                }
                return ''
            },
            getmapname(live_id, diff = false) {
                if (this.maps && this.maps['' + live_id]) {

                    const i = this.maps['' + live_id]
                    return i['name'] + (diff ? ' [' + i['difficulty_text'] + ']' : '')
                }
                return null
            },
            getpercent(live) {
                const p = live['perfect_cnt']
                const combo_all = live['perfect_cnt'] + live['great_cnt'] + live['good_cnt'] + live['miss_cnt'] + live['bad_cnt']
                return (Math.round(p / combo_all * 1000) / 10.0 + "%")
            },
            getavatarsrc(unit_id) {
                if (unit_id) {
                    const urls = "https://db.loveliv.es/png/icon_from_unit_id/" + unit_id + "/" + "0.png";
                    return urls
                } else {
                    return "http://rawfile.loveliv.es/assets/image/ui/common/com_win_22.png"
                }
            },
            raw_file(path){
                const hosts = "https://rawfile.loveliv.es/"
                return hosts + path
            },
            list_or(list){
                for (var x of list) {
                    if (x) return true
                }
                return false
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
        width: 60px;
    }

    .wtround {
        width: 40px;
    }

    .wtcombo {
        width: 65px;
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

    .img-responsive {
        display: inline-block;
        height: auto;
        max-width: 100%;
        max-height: 250px;
    }
</style>