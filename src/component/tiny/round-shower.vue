<template>
    <div class="demo-step-container">
        <div class="demo-step-content" style="padding-bottom: 5px">
            <mu-stepper :activeStep="round-1" :linear="false">
                <mu-step v-for="i in showmax" :key="i">
                    <mu-step-button @click="changeStep(i)" :disabled="needdisable(i)">
                        R. {{i}}
                    </mu-step-button>
                </mu-step>
            </mu-stepper>
        </div>
        <div v-if="lives[round-1]" class="live-info" style="margin-bottom: 10px">
            <div style="margin-bottom: 15px">
                <mu-table :selectable="false" :showCheckbox="false" :fixedHeader="false">
                    <mu-thead slot="header">
                        <mu-th class="wtcover ht50">获得pt</mu-th>
                        <mu-th class="wtscore ht50">LIVE Rank</mu-th>
                        <mu-th class="wtscore ht50">Score</mu-th>
                        <mu-th class="wtcombo ht50">Combo &判</mu-th>
                        <mu-th class="wtnotes ht50">P/Great Good/B/M</mu-th>
                        <mu-th class="wtcombo ht50">Love pt</mu-th>
                        <mu-th class="wtper ht50">P率</mu-th>
                    </mu-thead>
                    <mu-tbody>
                        <mu-tr
                                :class="(lives[round-1]['live_setting_id'] && lives[round-1]['max_combo']==maps[lives[round-1]['live_setting_id']].s_rank_combo)?'live-fc':''">
                            <mu-td>
                                {{lives[round - 1]['event_point']}} pt
                            </mu-td>
                            <mu-td>
                                {{transrank(lives[round - 1].rank)}} / {{transrank(lives[round - 1].combo_rank)}}
                            </mu-td>
                            <mu-td>{{lives[round - 1]['score']}}</mu-td>
                            <mu-td>
                                {{lives[round - 1]['max_combo']}}
                                <span v-if="lives[round-1]['live_setting_id']">{{lives[round - 1]['max_combo'] == maps[lives[round - 1]['live_setting_id']].s_rank_combo ? " FC " : '/' + (maps[lives[round - 1]['live_setting_id']].s_rank_combo || ' - ')}}

                            </span>
                                <span v-if="lives[round-1].judge_card>=0"> &{{lives[round-1].judge_card}}</span>

                            </mu-td>
                            <mu-td>{{lives[round - 1]['perfect_cnt'] + "/" + lives[round - 1]['great_cnt']}}
                                <span style="margin-left: 10px">{{lives[round - 1]['good_cnt'] + "/" + lives[round - 1]['bad_cnt'] + "/" + lives[round - 1]['miss_cnt']}}</span>
                            </mu-td>
                            <mu-td>{{lives[round - 1].love_cnt}} pt</mu-td>
                            <mu-td>{{getpercent(lives[round - 1])}}</mu-td>
                        </mu-tr>
                    </mu-tbody>
                </mu-table>
            </div>
            <mu-row gutter>
                <mu-col width="100" tablet="35" desktop="35">
                    <live-cover :sisSize="48" :key="pair+''+round" :randomlive="lives[round-1].is_random != 0"
                                :attr="getmapattrid(lives[round-1].live_setting_id)"
                                :src="getlive_iconsrc(lives[round-1].live_setting_id)">
                    </live-cover>
                </mu-col>
                <mu-col width="100" tablet="65" desktop="60">
                    <p style="text-align: center">
                        <span style="margin-right: 20px">{{getmapname(lives[round - 1].live_setting_id)}} </span>
                        <span style="font-size: small">{{timefmt(lives[round - 1]['update_time'])}}</span>
                    </p>
                    <mu-divider></mu-divider>
                    <mu-table :selectable="false" :showCheckbox="false" :fixedHeader="false">
                        <mu-thead slot="header" style="height: 50px">
                            <mu-th style="text-align: center;height: 50px" class="wtcover">Mission</mu-th>

                            <mu-th style="text-align: center;height: 50px" class="wtnotes">Bonus</mu-th>

                            <mu-th style="text-align: center;height: 50px" class="wtper">达成</mu-th>
                        </mu-thead>
                        <mu-tbody>
                            <mu-tr v-for="val,k in lives[round-1].mission_result" :key="k">
                                <mu-td style="text-align: center">
                                    {{val.mission}}
                                </mu-td>
                                <mu-td style="text-align: center">
                                    {{val.bonus}}
                                </mu-td>
                                <mu-td style="text-align: center">
                                    {{val.achieved ? "达成" : "未达成"}}
                                </mu-td>
                            </mu-tr>
                            <mu-tr v-if="lives[round-1].mission_result.length <=0">
                                <mu-td></mu-td>
                                <mu-td style="text-align: center;font-size: medium"> 无任务</mu-td>
                                <mu-td></mu-td>
                            </mu-tr>
                        </mu-tbody>
                    </mu-table>
                </mu-col>
            </mu-row>
            <template v-if="lives[round-1].challenge_items.length">
                <mu-divider style="margin: 6px 0"></mu-divider>
                <mu-table>

                    <mu-tr>
                        <mu-td v-for="val,k in lives[round-1].challenge_items" :key="k" style="text-align: center">
                            <img v-if="val.asset" :src="raw_file(val.asset)" alt="" class="img-responsive"
                                 style="max-height: 50px"><br>{{val.desc}}
                        </mu-td>
                    </mu-tr>
                </mu-table>
            </template>
            <mu-divider style="margin: 6px 0"></mu-divider>
        </div>


    </div>
</template>

<script>
    import util from '../../util.js'
    import livecover from './live-cover.vue'
    export default {
        data () {
            return {
                round: this.roundin || this.defaultround,
            }
        },
        props: {
            pair: {},
            roundin: {
                type: Number,
                default: null
            },
            showmax: {
                type: Number,
                required: true
            },
            maps: {
                required: true
            },
            lives: {
                type: Array,
                required: true
            },
            allowmax: {
                type: Number,
                default: this.showmax
            },
            showmin: {
                type: Number,
                default: 1
            },
            showbox: {
                type: Array,
                default: null
            }
        },
        created() {
            if (!this.roundin) this.round = this.defaultround
//            if(this.round) this.live=this.lives[this.round]
        },
        computed: {
            defaultround(){
                for (let i = this.showmax; i >= 0; i--) {
                    if (!this.needdisable(i)) {
                        return i
                    }
                }
                return 0
            }
        },
        watch: {
            'roundin': "dynround",
            'pair': "dynround",
            'showbox': "dynround",
        },
        methods: {
            changeStep (index) {
                this.round = index
            },
            needdisable (curr_round){
                if (this.showbox && this.showbox.length >= this.showmax) {
                    return !this.showbox[curr_round - 1]
                } else {
                    return curr_round > this.allowmax || curr_round < this.showmin
                }
            },
            changeround(){
                this.round = this.roundin || this.defaultround
            },
            dynround(){
                this.round = this.roundin || this.defaultround
            },

            getpercent(live) {
                const p = live['perfect_cnt']
                const combo_all = live['perfect_cnt'] + live['great_cnt'] + live['good_cnt'] + live['miss_cnt'] + live['bad_cnt']
                return (Math.round(p / combo_all * 1000) / 10.0 + "%")
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
            getmapattrid(live_id){
                if (this.maps && this.maps[live_id]) {

                    return this.maps[live_id].attribute_icon_id;
                }
                return null
            },
            raw_file(path){
                const hosts = util.asset_root
                return hosts + path
            },
            timefmt(isotime){
                return isotime.replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ")
            },
            transrank(rank){
                return ['S', 'A', 'B', 'C', '-'][parseInt(rank) - 1]
            }
        },
        components: {
            'live-cover': livecover
        }
    }
</script>

<style>
    .demo-step-container {
        width: 100%;

        margin: auto;
    }

    .demo-step-content {
        margin: 0 5px;
        overflow-x: auto;
    }

    .demo-step-button {
        margin-top: 12px;
        margin-right: 12px;
    }

    .live-info {
        text-align: left;
        margin: 0 16px;
    }

    .ht50 {
        height: 50px;
    }

    .live-fc {
        background-color: rgba(253, 239, 255, 0.65);
    }
</style>
