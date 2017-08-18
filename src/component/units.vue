<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
            <!--<pre>{{error}}</pre>-->
        </mu-card>
        <mu-card class="loading" v-else-if="loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="units" style="padding: 15px 0px">
            <!--<mu-card-header title="Myron Avatar" subTitle="sub title">-->
            <!--<mu-avatar src="/images/uicon.jpg" slot="avatar"/>-->
            <!--</mu-card-header>-->

            <mu-card-title title="社员信息" subTitle="所有社员 不含N" style=""></mu-card-title>

            <mu-card-text>
                <a :href="'https://llsif.sokka.cn/other/unitsExportUTF16/?uid='+$route.params.id"
                   :download="$route.params.id+'.666'">
                    <mu-raised-button icon="import_export" labelPosition="before" secondary
                                      label="导出至LL组卡器" style="margin-right: 15px;margin-bottom: 5px"></mu-raised-button>
                </a>
                <mu-raised-button style="margin-right: 15px;margin-bottom: 5px" icon="import_export"
                                  labelPosition="before" secondary
                                  label="JSON文本"
                                  @click="dialog=true"></mu-raised-button>


                <a :href="url" v-if="isAppleD() || loadingframe" target="_blank">
                    <mu-raised-button style="margin-right: 15px;margin-bottom: 5px" icon="import_export"
                                      labelPosition="before" secondary
                                      label="导出至LLSIF - AutoTeamBuilder"
                    ></mu-raised-button>
                </a>
                <mu-raised-button v-else="" style="margin-right: 15px;margin-bottom: 5px" icon="import_export"
                                  labelPosition="before"
                                  secondary
                                  label="导出至LLSIF - AutoTeamBuilder" @click="export_team_builder()"
                                  :disabled="loadingframe"
                ></mu-raised-button>

                <br>

                <!--<span style="margin-top: 18px">JSON信息 可用于 <a target="_blank" href="https://llsifteambuilder.herokuapp.com/build_team/">LLSIF-AutoTeamBuilder</a></span>-->
            </mu-card-text>
            <mu-divider></mu-divider>
            <div>
                <mu-table ref="infotable" :selectable="false" :showCheckbox="false" :fixedHeader="false" height="600px">
                    <mu-thead slot="header">
                        <mu-th class="mt-avatar">Avatar/获得时间</mu-th>
                        <!--<mu-th>unit id</mu-th>-->
                        <!--<mu-th>owning id</mu-th>-->

                        <mu-th>绊</mu-th>
                        <mu-th>Level</mu-th>
                        <mu-th>Exp</mu-th>
                        <mu-th>技能Lv.</mu-th>
                        <mu-th>技能Exp</mu-th>
                        <!--<mu-th>获得时间</mu-th>-->
                        <!--<mu-th>觉醒</mu-th>-->
                    </mu-thead>
                    <mu-tbody>
                        <mu-tr v-for="unit,index in units" :key="index">
                            <mu-td class="mt-avatar">

                                <mu-badge class="demo-badge-content" circle :color="unit['is_love_max']?'white':'white'"
                                          v-if="unit['is_rank_max']">
                                    <mu-avatar :src="getavatarsrc(unit)" :size="50"></mu-avatar>
                                    <mu-icon value="star" slot="content" color="pinkA100"
                                             v-if="unit['is_love_max']"
                                    ></mu-icon>
                                    <mu-icon value="star" slot="content" color="LightGreen" v-else=""
                                    ></mu-icon>

                                </mu-badge>
                                <mu-badge class="demo-badge-content" v-else>
                                    <mu-avatar :src="getavatarsrc(unit)" :size="50"></mu-avatar>
                                </mu-badge>
                                <br><span
                                    style="font-size: 85%">{{ unit['insert_date'].replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ").slice(0, -3)}}</span>
                            </mu-td>
                            <!--<mu-td>{{unit['unit_id']}}</mu-td>-->
                            <!--<mu-td>{{unit['unit_owning_user_id']}}</mu-td>-->

                            <mu-td>{{unit['love'] + "/" + unit['max_love']}}</mu-td>
                            <mu-td>{{unit['level'] + "/" + unit['max_level']}}</mu-td>
                            <mu-td>{{unit['exp']}}</mu-td>
                            <mu-td>{{unit['unit_skill_level']}}</mu-td>
                            <mu-td>{{unit['unit_skill_exp']}}</mu-td>
                            <!--<mu-td>{{unit['insert_date'].split("T")[0]}}</mu-td>-->
                            <!--<mu-td>{{(unit['rank'] == unit['max_rank']) ? "是" : ""}}</mu-td>-->

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
        <mu-dialog :open="dialog" title="队伍 社员 学园偶像技能" @close="close">
            <mu-text-field v-model="export_code" fullWidth multiLine :rowsMax="15"></mu-text-field>
            <br/>
            <mu-flat-button v-if="export_code!='null'" slot="actions" v-clipboard:copy="export_code"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError" primary label="复制"></mu-flat-button>
            <mu-flat-button slot="actions" v-else primary label="关闭" @click="close()"></mu-flat-button>
        </mu-dialog>
        <mu-toast v-if="toast" :message="toast" @close="hideToast"/>
        <iframe hidden id="exportframe" name="frame1" @load="loadingframe=false"
                src="https://llsifteambuilder.herokuapp.com/build_team/receive_user_json" frameborder="0"></iframe>
        <a ref="TBlink" target="_blank" href="https://llsifteambuilder.herokuapp.com/build_team/"></a>
    </div>
</template>

<script>
    import axios from 'axios'
    import download from 'downloadjs/download.min'
    import bus from '../bus.js'
    import util from '../util.js'

    export default {
        data(){
            return {
                loadingapi: false,
                units: null,
                page: 1,
                limit: 15,
                count: null,
                error: null,
                mergetoolString: null,
                export_code: null,
                dialog: false,
                toast: false,
                loadingframe: true,
                url: "https://llsifteambuilder.herokuapp.com/build_team/LLproxy_user_json?uid=" + this.$route.params.id

            }
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData()
            bus.$on('refresh', () => {

                this.fetchData()

            })
            this.$on('jump', () => {
                if (this.isAppleD()) {
                    location = "https://llsifteambuilder.herokuapp.com/build_team/LLproxy_user_json?uid=" + this.$route.params.id
                } else {
                    const url = "https://llsifteambuilder.herokuapp.com/build_team/"
//                    location = url
                    if (!window.open(url)) {
                        location = url
                    }
                }


            })
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData',
            'dialog': 'fetchCode'
        },

        methods: {
            isAppleD(){
                const matchs = [/Apple/ig, /Safari/ig, /Edge/ig, /Trident/ig, /Opera/ig];
                for (const match of matchs) {
                    if (navigator.userAgent.match(match)) return true
                }
                return false
            },
            onCopy: function (e) {
                this.toast = "复制成功"
                this.toastTimer = setTimeout(() => {
                    this.toast = false
                }, 1000)
                this.close()
                this.export_code = null
            },
            onError: function (e) {
                this.toast = "复制失败,请手动复制"
                this.toastTimer = setTimeout(() => {
                    this.toast = false
                }, 1000)
            },
            hideToast () {
                this.toast = false
                if (this.toastTimer) clearTimeout(this.toastTimer)
            },
            close () {
                this.dialog = false
            },
            handlepage (newIndex) {
                this.page = newIndex
                this.fetchData(false)
                document.getElementsByClassName('mu-table')[0].parentElement.scrollTop = 0

            },
            fetchData (reload = true) {
                this.error = this.userinfo = null;
                reload && (this.loadingapi = true);
                // replace getPost with your data fetching util / API wrapper
                const vm = this;
                axios.get(util.api_server + 'llproxy/unitsInfo/', {
                    params: {
                        uid: vm.$route.params.id,
                        limit: vm.limit,
                        page: vm.page
                    }
                })
                    .then(function (response) {
                        reload && (vm.loadingapi = false);
                        vm.units = response.data['result']['units'];
                        vm.page = response.data['result']['curr_page'];
                        vm.limit = response.data['result']['limit'];
                        vm.count = response.data['result']['count']
                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err)

                    })


            },
            getavatarsrc(unit) {
                if (this.units && unit) {
                    const urls = util.icon_root + unit['unit_id'] + "/" + (unit['display_rank'] - 1) + ".png";
                    return urls
                } else {
                    return util.asset_root + "assets/image/ui/common/com_win_22.png"
                }
            },
            downf(){
                download("https://llsif.sokka.cn/other/unitsExportUTF16/?uid=" + this.$route.params.id)
            },
            export_team_builder(){
                const vm = this
                const frm = document.getElementById("exportframe")
                axios.get(util.api_server + 'llproxy/unitsExportJSON/', {
                    params: {uid: vm.$route.params.id}
                })
                    .then(function (response2) {
                        const code = response2.data.result.JSONString;

                        window.frames["frame1"].postMessage(code, '*')
                        vm.$emit('jump')

                    })
                    .catch(function (err2) {
                        console.log(err2)
                    })
                return true

            },
            fetchCode(){
                const vm = this
                if (!vm.dialog) {
                    return
                }
                axios.get(util.api_server + 'llproxy/unitsExportJSON/', {
                    params: {uid: vm.$route.params.id, full: true}
                })
                    .then(function (response2) {
                        const code = response2.data.result.JSONString;
                        vm.export_code = code || 'null'
                    })
                    .catch(function (err2) {
                        console.log(err2)
                    })
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

    .infotable {
        text-align: center;
        overflow: hidden;
    }

    .mu-td, .mu-th {
        padding-left: 16px;
        padding-right: 5px;
        text-align: center;
        white-space: normal;
    }

    .mt-avatar {

    }
</style>