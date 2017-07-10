<template>
    <div>
        <mu-card v-if="loadingapi" class="loading">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="decks" style="padding: 15px 0px">

            <mu-card-title title="队伍" subTitle="" style=""></mu-card-title>

            <mu-card-text style="margin-bottom: 20px">
                图标下为社员的 等级 /技能等级 /宝石槽数
            </mu-card-text>
            <div>
                <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="false"
                          height="auto">
                    <mu-thead slot="header">
                        <th class="wt100" style="text-align: center;">导出</th>
                        <th class="wt10" v-for="thh in th_list">{{thh.title}}</th>
                    </mu-thead>
                    <mu-tbody>
                        <mu-tr :class="deck.main_flag ?'main-flag':false" v-for="deck,index in decks" :key="index">
                            <td class="wt100">
                                <mu-flat-button @click="openBottomSheet(index)" :label="deck.deck_name"
                                                class="demo-flat-button" labelPosition="before" icon="import_export"
                                                secondary></mu-flat-button>
                                <br>{{deck.main_flag ? '主力' : ''}}

                            </td>
                            <td class="wt10" v-for="n in 9">
                                <mu-avatar class="avatar" :src="getavatarsrc(deck.units[n])" slot="avatar"
                                           :size="63"></mu-avatar>
                                <br>
                                <template v-if="deck.units[n]">
                                    {{deck.units[n].level}} /{{deck.units[n].unit_skill_level}} /{{deck.units[n].unit_removable_skill_capacity}}
                                    <!--<br>[ {{deck.units[n].unit_removable_skill_id.join(', ')}} ]-->
                                    <br>
                                    <img v-if="deck.units[n].unit_removable_skill_id.length==0"
                                         src="https://rawfile.loveliv.es/assets/image/ui/common/com_etc_68.png"
                                         class="skill" alt="">

                                    <img :key="index" v-for="sid,index in deck.units[n].unit_removable_skill_id"
                                         :src="getskillsrc(sid)" :alt="skills[sid].name" class="skill"/>
                                </template>
                                <template v-else>
                                    <br><img src="https://rawfile.loveliv.es/assets/image/ui/common/com_etc_68.png"
                                             class="skill" alt="">

                                </template>
                            </td>
                        </mu-tr>
                    </mu-tbody>
                </mu-table>
            </div>
        </mu-card>
        <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
            <mu-list @itemClick="closeBottomSheet">
                <mu-sub-header>
                    请选择导出
                </mu-sub-header>


                <mu-list-item @click="exportdeck(true)">
                    LLhelper
                </mu-list-item>

                <mu-list-item @click="exportdeck()">
                    LoveLive! 查卡器 CardViewer
                </mu-list-item>


            </mu-list>
        </mu-bottom-sheet>
        <mu-dialog :open="dialog" title="查卡器导入码" @close="close">
            <mu-text-field v-model="export_code" fullWidth></mu-text-field>
            <br/>
            <mu-flat-button v-if="export_code!='获取失败'" slot="actions"  v-clipboard:copy="export_code" v-clipboard:success="onCopy"
                            v-clipboard:error="onError" primary  label="复制"></mu-flat-button>
            <mu-flat-button slot="actions" v-else primary  label="关闭" @click="close()"></mu-flat-button>
        </mu-dialog>
        <mu-toast v-if="toast" :message="toast" @close="hideToast"/>
    </div>
</template>

<script>
    import axios from 'axios'
    import download from 'downloadjs/download.min'
    export default {
        data(){
            return {
                loadingapi: false,
                bottomSheet: false,
                sltdeck: null,
                th_list: [
                    {
                        title: 'L1'
                    },
                    {
                        title: 'L2'
                    },
                    {
                        title: 'L3'
                    },
                    {
                        title: 'L4'
                    },
                    {
                        title: 'C'
                    },
                    {
                        title: 'R4'
                    },
                    {
                        title: 'R3'
                    },
                    {
                        title: 'R2'
                    },
                    {
                        title: 'R1'
                    }
                ],
                export_deck: null,
                export_code: null,
                dialog: false,
                toast: false,
                msg: null
            }
        },
        props: {
            decks: {
                type: Array,
                required: true
            },
            skills: {
                type: Object,
                required: true
            }
        },
        created () {

        },
        watch: {
            // 如果路由有变化，会再次执行该方法
        },
        methods: {
            onCopy: function (e) {
                this.toast = "复制成功"
                this.toastTimer = setTimeout(() => { this.toast = false }, 1000)
                this.close()
                this.export_code=null
            },
            onError: function (e) {
                this.toast = "复制失败,请手动复制"
                this.toastTimer = setTimeout(() => { this.toast = false }, 1000)
            },
            hideToast () {
                this.toast = false
                if (this.toastTimer) clearTimeout(this.toastTimer)
            },
            pad(num, n){
                return (Array(n).join(0) + num).slice(-n);
            },
            getavatarsrc(unit) {
                if (unit && unit['unit_id']) {
                    const urls = "https://db.loveliv.es/png/icon_from_unit_id/" + unit['unit_id'] + "/" + (unit['display_rank'] - 1) + ".png";
                    return urls
                } else {
                    return "http://rawfile.loveliv.es/assets/image/ui/common/com_win_22.png"
                }
            },
            getskillsrc (skill_id){
                if (this.skills && this.skills.hasOwnProperty(skill_id)) {
                    return 'https://r.llsif.win/' + this.skills[skill_id].icon_asset
                }
                return false
            },
            closeBottomSheet () {
                this.bottomSheet = false
            },
            openBottomSheet (slt) {
                this.sltdeck = slt;
                const vm = this;
                axios.get('https://llsif.sokka.cn/api/llproxy/deckExport/', {
                    params: {
                        uid: vm.$route.params.id,
                        deck_id: vm.decks[vm.sltdeck].unit_deck_id
                    }
                })
                    .then(function (response) {
                        vm.export_deck = response.data.result;
                        vm.fetchCode(response.data.result.cardviewerString)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
                this.bottomSheet = true
            },
            exportdeck(llhelper = false){
                if (llhelper) {
                    const llhelper = this.export_deck.llhelperString;
                    download(llhelper, this.decks[this.sltdeck].deck_name + '.sd', 'text/plain');
                } else {
                    this.dialog = true
                }


            },
            fetchCode(codestring){
                const vm = this
                axios.post('https://llsif.sokka.cn/api/llproxy/cardViewerCode/', {
                    info_string: codestring
                })
                    .then(function (response2) {
                        const code = response2.data.result.code;
                        vm.export_code = code || '获取失败'
                    })
                    .catch(function (err2) {
                        console.log(err2)
                    })
            },
            close () {
                this.dialog = false
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

    .list-item {
        text-align: center;
    }

    .wt10 {
        width: 70px;
    }

    .wt100 {
        /*text-align: left;*/
        width: 125px;
    }

    .livetable {
        width: auto;
        text-align: center;
    }

    .avatar {
        margin: 5px;
    }

    .skill {
        max-width: 25px;
        margin: 0 2px;
    }

    .demo-flat-button {
        overflow: hidden;
        white-space: nowrap;
        margin: 5px;
    }

    .main-flag {
        background-color: #f3e5f5;
    }
</style>