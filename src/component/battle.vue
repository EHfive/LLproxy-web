<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败,请重试或刷新,或者并无记录</p>
            {{error}}
        </mu-card>
        <mu-card class="loading" v-else-if="loadingmap || loadingapi || loadingevent">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>

        <mu-card v-else-if="lives&&maps" style="padding: 0px 0px">
            <!--<mu-card-header title="Myron Avatar" subTitle="sub title">-->
            <!--<mu-avatar src="/images/uicon.jpg" slot="avatar"/>-->
            <!--</mu-card-header>-->
            <mu-tabs :value="activeTab" @change="handleTabChange">
                <mu-tab value="log" title="Score Match 记录" @click="handleLog()"/>
                <!--<mu-tab value="info" title="Live 详细" @click="handleInfo()"/>-->
                <!--<mu-tab value="combo" title="权重 Combo" @click="handleCombo()"/>-->
                <!--<mu-tab value="count" title="统计" @click="handleCount()"/>-->
            </mu-tabs>
            <mu-content-block style="margin-left: 10px">

                <mu-select-field v-model="sltevent" label="选择活动" style="margin-right: 15px">
                    <mu-menu-item v-for="vals,index in eventlist" :key="index" :value="vals.event_id"
                                  :title="vals.title+' /'+vals.event_id"
                    ></mu-menu-item>
                </mu-select-field>
                <!--<mu-switch  label="显示非活动曲" v-model="shownormal" labelLeft=""></mu-switch>-->
            </mu-content-block>
            <div v-if="activeTab === 'log'">
                <mu-card-text>
                    点击歌曲名查看房间详细 , 点击上方 Tab 刷新
                </mu-card-text>
                <mu-divider></mu-divider>
                <div>
                    <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="false"
                              height="560px">
                        <mu-thead slot="header" class="tbth">
                            <mu-th style="width: 80px">房号</mu-th>
                            <mu-th style="width: 50px">获得pt</mu-th>
                            <mu-th style="width: 50px">SMpt</mu-th>
                            <mu-th style="width: 130px">Map/Date</mu-th>
                            <mu-th style="width: 75px">Score #rank</mu-th>
                            <mu-th style="width: 70px">Combo &判</mu-th>
                            <mu-th style="width: 120px">P/Grt Gd/B/M</mu-th>
                            <mu-th style="width: 60px">P率</mu-th>
                        </mu-thead>
                        <mu-tbody>
                            <mu-tr v-for="live,index in lives" :key="index"
                                   :class="(live['max_combo']==maps[live['live_setting_id']].s_rank_combo?'live-fc':'')">
                                <mu-td style="font-size: 100%" class="cursor-pointer" @click="goto_room(live,index)">
                                    {{live['event_battle_room_id']}}
                                </mu-td>
                                <mu-td>
                                    <span v-if="live['status']>1">{{live['added_event_point']}} pt</span><span
                                        v-else>-</span>
                                </mu-td>
                                <mu-td>
                                    <span v-if="live['status']>1">{{live['match']['rating_status']['rating']}}
                                        ({{add_add(live['match']['rating_status']['evaluation'])}})</span><span
                                        v-else>-</span>
                                </mu-td>
                                <mu-td class="cursor-pointer" @click="goto_room(live,index)">
                                    <span>
                                        {{ getmapname(live['live_setting_id'], false) || ("difficulty-id: " + live['live_difficulty_id'])}}
                                        <br>
                                    </span>
                                    <span
                                            style="font-size: 85%">{{ live['update_time'].replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ")}}</span>
                                </mu-td>

                                <mu-td>
                                    <span v-if="live['status']>1">{{live['score']}} #{{live['match']['battle_rank']}}</span>
                                    <span v-else>-</span>
                                </mu-td>
                                <mu-td>
                                    {{live['max_combo']}}{{live['max_combo'] == maps[live['live_setting_id']].s_rank_combo ? " FC" : '/' + (maps[live['live_setting_id']].s_rank_combo || ' - ')}}
                                    <span v-if="live.judge_card>=0"> &{{live.judge_card}}</span>
                                </mu-td>
                                <mu-td>
                                    <span v-if="live['status']>1">{{live['perfect_cnt'] + "/" + live['great_cnt']}}
                                    <span style="margin-left: 10px">{{live['good_cnt'] + "/" + live['bad_cnt'] + "/" + live['miss_cnt']}}</span></span>
                                    <span v-else>-</span>
                                </mu-td>
                                <mu-td>
                                    <span v-if="live['status']>1">{{getpercent(live)}}</span>
                                    <span v-else>-</span>
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
        </mu-card>
        <div hidden>
            <mu-dialog v-if="clive" :open="dialog" scrollable
                       :title="'#'+clive.event_battle_room_id+' - '+getmapname(clive['live_setting_id'], true)"
                       @close="close" actionsContainerClass="room-dialog-action"
                       bodyClass="room-dialog-body" dialogClass="room-dialog" titleClass="room-dialog-title">
                <mu-paper v-for="user,k in clive.matching_user" class="user-paper" :key="k" v-if="user">

                    <mu-badge v-if="user.user_info && user.user_info.user_id == clive.uid" content="你"
                              class="demo-icon-badge" circle
                              secondary>
                        <mu-avatar :size="75" :src="getavatarsrc(user.center_unit_info)"
                                   class="room-avatar"></mu-avatar>
                    </mu-badge>
                    <mu-avatar v-else :size="75" :src="getavatarsrc(user.center_unit_info)"
                               style="margin: 5px 5px 5px 10px;"></mu-avatar>

                    <div v-if="user.user_info" class="room-name">
                        {{user.user_info.name}}
                    </div>
                    <div v-else-if="user.npc_info" class="room-name">
                        {{user.npc_info.name}} [NPC]
                    </div>

                    <div v-if="clive.status == 3" class="room-name" style="width: 110px">
                        <span class="room-key">SCORE :</span>
                        {{user.result.score_smile + user.result.score_cute + user.result.score_cool}}<br>
                        <span class="room-key">COMBO :</span>
                        <span v-if="user.result.is_full_combo" style="color: rgba(167,51,229,0.9)">
                            {{user.result.max_combo}} FC
                        </span>
                        <span v-else>
                            {{user.result.max_combo}}
                        </span>
                    </div>

                    <div class="room-name" style="width: 120px">
                        <template v-if="user.event_battle_rating_status">
                            <span class="room-key">SMpt :</span>
                            {{user.event_battle_rating_status.rating}}<br>
                            <span v-if="clive.status == 3">({{add_add(user.event_battle_rating_status.evaluation)}}) <br></span>

                            <span class="room-key">SMpt Rank :</span>
                            {{user.event_battle_rating_status.rating_rank}}
                        </template>

                    </div>
                    <div class="room-name" style="width: 100px">
                        <template v-if="user.event_status">
                            <span class="room-key">pt :</span>
                            {{user.event_status.total_event_point}}
                            <br>
                            <span class="room-key">pt Rank :</span>
                            {{user.event_status.event_rank}}
                        </template>
                    </div>
                    <div v-if="clive.status == 3" class="room-rank">
                        {{user.result.battle_rank}}
                    </div>
                </mu-paper>
                <template slot="actions">
                    <div style="margin-left: 10px">
                        <mu-flat-button secondary @click="roomNew" label="Newer" style="margin-right: 10px"/>
                        <mu-flat-button secondary @click="roomForward" label="Forward"/>
                    </div>
                    <span class="room-key" style="color: #7e848c">{{timefmt(clive.update_time)}}</span>
                    <mu-flat-button primary @click="close" label="确定" style="margin-left: 10px;margin-right: 10px"/>
                </template>

            </mu-dialog>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import bus from '../bus.js'
    import util from '../util.js'
    import livecover from './tiny/live-cover.vue'
    const localkey = 'battle_tab';
    export default {
        data(){
            return {
                loadingmap: true,
                loadingapi: true,
                loadingevent: true,
                lives: null,
                clive: null,
                cpnt: 0,
                page: 1,
                all_page: null,
                limit: 8,
                count: null,
                dialog: false,
                error: null,
                maps: null,
                last_pair_id: 0,
                pair_id: this.$route.query.pairid || -1,
                sltevent: 0,
                feslive: null,
                weight: null,
                activeTab: util.getkey(localkey) || 'log',
//                activeTab: this.$route.query.pairid && this.$route.query.eventid ? 'info' : 'log',
                eventview: null,
                eventlist: []

            }
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            const vm = this;
            this.loadingevent = true;
            util.eventlistPromise(2).then(function (result) {
                vm.eventlist = result.event_list;
                vm.sltevent = result.sltevent;
                vm.loadingevent = false
            }).catch(function () {
                vm.sltevent = util.selectevent(vm.eventlist);
                vm.loadingevent = false
            });
            this.fetchMap();
            if (this.$route.query.eventid) this.sltevent = this.$route.query.eventid;
            this.pair_id = -1;
            bus.$on('refresh', () => {
//                this.fetchLive();
                this.fetchData(true)

            })

        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData',
//            'shownormal': 'changept',
            'sltevent': 'changept',
//            'pair_id': 'fetchLive'
        },

        methods: {
            open () {
                this.dialog = true
            },
            close () {
                this.dialog = false
            },
            changept(){
                this.page = 1;
//                this.fetchLive();
//                this.fetchWeight();
                this.fetchData(true)
            },
            add_add(num){
                if (num < 0) return num.toString();
                else return '+' + num.toString()
            },
            roomNew(){
                if (this.cpnt <= 0) {
                    if (this.page <= 1) {
                        this.page = 1;
                        const vm = this;
                        this.fetchData(true, function () {
                            vm.cpnt = 0;
                            vm.clive = vm.lives[vm.cpnt];
                            vm.open()
                        })
                    } else {
                        this.page -= 1;
                        const vm = this;
                        this.fetchData(true, function () {
                            vm.cpnt = vm.lives.length - 1;
                            vm.clive = vm.lives[vm.cpnt];
                            vm.open()
                        })
                    }
                } else {
                    this.cpnt -= 1;
                    this.clive = this.lives[this.cpnt]
                }
            },
            roomForward(){
                if (this.cpnt >= this.lives.length - 1) {
                    if (this.page >= this.all_page) {
                        this.page = this.all_page;
                        const vm = this;
                        this.fetchData(true, function () {
                            vm.cpnt = vm.lives.length - 1;
                            vm.clive = vm.lives[vm.cpnt];
                            vm.open()
                        })
                    } else {
                        this.page += 1;
                        const vm = this;
                        this.fetchData(true, function () {
                            vm.cpnt = 0;
                            vm.clive = vm.lives[vm.cpnt];
                            vm.open()
                        })
                    }
                } else {
                    this.cpnt += 1;
                    this.clive = this.lives[this.cpnt]
                }
            },
//            handleNew(){
//                if (this.pair_id === -1 || this.pair_id === this.last_pair_id) this.fetchLive();
//                else {
//                    if (this.feslive || this.pair_id <= this.last_pair_id) this.pair_id += 1;
//                    else this.pair_id = -1
//                }
//
//            },
//            handleForward(){
//                if (!this.feslive && this.pair_id > this.last_pair_id) {
//                    this.pair_id = -1;
//                    return
//                }
//                if (this.pair_id === -1) this.pair_id = this.feslive.pair_id - 1;
//                else {
//                    if (this.pair_id >= 2) this.pair_id -= 1
//                }
//            },
            handleTabChange (val) {

                this.activeTab = val;
                util.setkey(localkey, val)

            },
            handleLog(){
                this.fetchData(false)
            },
            handleCombo(){
                this.fetchWeight()
            },
            handleCount(){
                this.fetchData(false)
            },
//            handleInfo () {
//                this.pair_id = -1;
//                this.fetchLive();
//            },
            goto_room(live, pnt){
                this.clive = live;
                this.cpnt = pnt;
                this.open()
            },
            handlepage (newIndex) {
                this.page = newIndex;
                this.fetchData(true);
                document.getElementsByClassName('mu-table')[0].parentElement.scrollTop = 0
            },
            fetchMap (reload = true){
                reload && (this.loadingmap = true);
                const vm = this;
                const map_url = util.live_map;
                axios.get(map_url)
                    .then(function (response) {
                        vm.maps = response.data;
                        vm.loadingmap = false;
                    })
                    .catch(function (err) {
                        vm.error = err.toString();
                        console.log(err)

                    })
            },

            fetchData (reload = true, setclive = null) {

                reload && (this.loadingapi = true);
                const vm = this;
                axios.get(util.api_server + 'llproxy/eventBattle/', {
                    params: {
                        uid: vm.$route.params.id,
                        limit: vm.limit,
                        page: vm.page,
                        eventid: vm.sltevent || vm.$route.query.eventid || null,
                    }
                })
                    .then(function (response) {

                        vm.lives = vm.matching_info_adder(response.data['result']['lives']);
                        vm.page = response.data['result']['curr_page'];
                        vm.limit = response.data['result']['limit'];
                        vm.count = response.data['result']['count'];
                        vm.all_page = response.data['result']['all_page'];
                        vm.loadingapi = false;
                        setclive && setclive()
                    })
                    .catch(function (err) {
                        vm.error = err.toString();
                        console.log(err)

                    });


            },
//            fetchWeight(){
//                const vm = this;
//                axios.get(util.api_server + 'llproxy/eventFestivalLast/', {
//                    params: {
//                        uid: vm.$route.params.id,
//                    }
//                })
//                    .then(function (response) {
//
//                        vm.weight = response.data.result;
//                    })
//                    .catch(function (err) {
//                        vm.error = err.toString();
//                        console.log(err)
//
//                    })
//            },
            matching_info_adder(lives, uid){
                if (!uid) uid = this.$route.params.id;
                uid = parseInt(uid);
                for (let i = 0; i < lives.length; i++) {
                    const matching_user = lives[i]['matching_user'];
//                    let mu = [null, null, null, null];
                    lives[i]['match'] = {
                        'battle_rank': '-',
                        'rating_status': {
                            'evaluation': '',
                            'rating': '',
                            'rating_rank': ''
                        }
                    };
//                    console.log(matching_user);
                    if (lives[i].status < 3) continue;
                    for (let j = 0; j < matching_user.length; j++) {
                        const u = matching_user[j];
//                        console.log(u);
//                        mu[u.result.battle_rank - 1] = u;
                        if (u.user_info && u.user_info.user_id === uid) {
                            lives[i]['match'] = {
                                'battle_rank': u.result.battle_rank,
                                'rating_status': {
                                    'evaluation': u.event_battle_rating_status.evaluation,
                                    'rating': u.event_battle_rating_status.rating,
                                    'rating_rank': u.event_battle_rating_status.rating_rank
                                }
                            };
                        }

                    }
//                    lives[i]['matching_user'] = mu
                    lives[i]['matching_user'].sort(function (a, b) {
                        return a.result.battle_rank - b.result.battle_rank
                    })

                }
                return lives
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
            getmapname(live_id, diff = false) {
                if (this.maps && this.maps['' + live_id]) {

                    const i = this.maps['' + live_id];
                    return i['name'] + (diff ? ' [' + i['difficulty_text'] + ']' : '')
                }
                return null
            },
            getmapattrid(live_id){
                if (this.maps && this.maps[live_id]) {

                    return this.maps[live_id].attribute_icon_id;
                }
                return null
            },
            getpercent(live) {
                const p = live['perfect_cnt'];
                const combo_all = live['perfect_cnt'] + live['great_cnt'] + live['good_cnt'] + live['miss_cnt'] + live['bad_cnt'];
                return (Math.round(p / combo_all * 1000) / 10.0 + "%")
            },
            getavatarsrc(unit) {
                if (unit && unit['unit_id']) {
                    return util.icon_root + unit['unit_id'] + "/" + (unit['display_rank'] - 1) + ".png";
                } else {
                    return util.asset_root + "assets/image/ui/common/com_win_22.png"
                }
            },
            raw_file(path){
                const hosts = util.asset_root;
                return hosts + path
            },
            list_or(list){
                for (var x of list) {
                    if (x) return true
                }
                return false
            },
            timefmt(isotime){
                return isotime.replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ")
            },

        },
        components: {
            'live-cover': livecover
        }
    }
</script>

<style type="less">
    .loading {
        padding: 120px;
        text-align: center;
    }

    .user-paper {
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
        align-items: Center;
        flex-wrap: wrap;
        min-height: 92px;
        width: 100%;
        margin: 10px 0 5px;
    }

    .room-avatar {
        margin: 5px 5px 5px 10px;
        /*width: 100%;*/
    }

    .room-key {
        font-size: x-small
    }

    .room-name {
        color: #59606b;
        width: 90px;
        max-height: 70px;
        margin: 5px 10px 5px 5px;
        overflow-wrap: break-word;
        overflow: hidden;
    }

    .room-rank {
        width: 40px;
        font-size: 35px;
        color: #7e848c;
        margin: 5px 5px 5px 10px;
    }

    .room-dialog {
        width: 95%;
        max-width: 768px;
        max-height: 555px !important;
        padding: 0;
        background-color: #fff;
        border-radius: 2px;
        font-size: 16px;
        box-shadow: 0 19px 60px rgba(0, 0, 0, .298039), 0 15px 20px rgba(0, 0, 0, .219608);
    }

    .room-dialog-body {
        max-height: 440px !important;
        /*overflow: scroll;*/
        padding-bottom: 0px;
    }

    .room-dialog-title {
        color: rgba(71, 74, 79, 0.6) !important;
        padding-bottom: 5px;
        .scrollable {
            border-bottom: none !important;
        }
    }

    .room-dialog-action {
        padding-bottom: 10px;
        justify-content: space-between;
    }

    .scrollable {
        border: none !important;
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

    .weight-table {
        .mu-td, .mu-th {
            padding-left: 16px;
            padding-right: 5px;
            height: auto;
            white-space: normal;
        }
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

    .left-h {
        font-size: small;
        font-weight: bold;
    }

    .text-c {
        height: 62px;
        text-align: center;
    }

    .img-responsive {
        display: inline-block;
        height: auto;
        /*max-width: 100%;*/
        /*max-height: 250px;*/
    }
</style>