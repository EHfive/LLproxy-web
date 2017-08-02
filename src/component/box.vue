<template>
    <div>
        <mu-card class="loading" v-if="loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="logs" style="padding: 15px 0px">
            <!--<mu-card-header title="Myron Avatar" subTitle="sub title">-->
            <!--<mu-avatar src="/images/uicon.jpg" slot="avatar"/>-->
            <!--</mu-card-header>-->

            <mu-card-title title="招募" :subTitle="bypt?'pt招募':'不含N'" style=""></mu-card-title>

            <mu-content-block style="margin-left: 10px">
                <mu-switch label="切换 普通生招募" v-model="bypt"></mu-switch>
                <br>
                <mu-switch v-if="bypt" style="" label="不显示 N" v-model="notshown"></mu-switch>
                <mu-switch v-else style="" label="显示 R" v-model="showr"></mu-switch>
            </mu-content-block>
            <div>
                <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="true"
                          :height="logs.length>10?'560px':'auto'">
                    <mu-thead slot="header">
                        <mu-th class="wtcardpool">卡池名称 /时间

                        </mu-th>

                        <template v-if="!bypt">
                            <mu-th>UR</mu-th>
                            <mu-th>SSR</mu-th>
                            <mu-th>SR</mu-th>
                        </template>

                        <mu-th>R</mu-th>
                        <mu-th v-if="bypt">N</mu-th>
                        <mu-th :class="bypt?'wtavatar-bypt':'wtavatar'">Avatars</mu-th>
                    </mu-thead>
                    <mu-tbody>
                        <mu-tr v-for="log,index in logs" :key="index" :class="bypt?'':'tr-notbypt'">
                            <mu-td class="wtcardpool">{{log.name}}
                                <br><span>{{ log['update_time'].replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ").slice(0, -3)}}</span>
                            </mu-td>

                            <template v-if="!bypt">
                                <mu-td>{{log['ur_cnt']}}</mu-td>
                                <mu-td>{{log['ssr_cnt']}}</mu-td>
                                <mu-td>{{log['sr_cnt']}}</mu-td>
                            </template>

                            <mu-td>{{log['r_cnt']}}</mu-td>
                            <mu-td v-if="bypt">{{log['n_cnt']}}</mu-td>
                            <mu-td :class="bypt?'wtavatar-bypt':'wtavatar'">
                                <mu-avatar v-for="unitid,indexu in log['result_unit_ids']" :key="indexu"
                                           :src="getavatarsrc(unitid)"
                                           v-if="bypt?(!notshown || (log['result_rarity_ids'][indexu] != 1)):(showr || (log['result_rarity_ids'][indexu] != 2))"></mu-avatar>
                            </mu-td>
                        </mu-tr>
                    </mu-tbody>
                </mu-table>
            </div>
            <mu-card-actions>
                <mu-pagination :total="count" :current="page" @pageChange="handlepage"
                               :defaultPageSize="limit">
                </mu-pagination>
            </mu-card-actions>
        </mu-card>

    </div>
</template>

<script>
    import axios from 'axios'
    import util from '../util.js'

    export default {
        data(){
            return {
                loadingapi: false,
                logs: null,
                page: 1,
                limit: 20,
                count: null,
                error: null,
                bypt: false,
                showr: false,
                notshown: false
            }
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData()
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData',
            'bypt': 'changept'
        },

        methods: {
            handlepage (newIndex) {
                this.page = newIndex
                this.fetchData(false)
                document.getElementsByClassName('mu-table')[1].parentElement.scrollTop = 0
            },
            changept(){
                this.page = 1
                this.fetchData(false)
            },
            fetchData (reload = true) {

                this.error = this.userinfo = null;
                reload && (this.loadingapi = true);
                // replace getPost with your data fetching util / API wrapper
                const vm = this;
                axios.get(util.api_server +'llproxy/secretBoxLog/', {
                    params: {
                        uid: vm.$route.params.id,
                        limit: vm.limit,
                        page: vm.page,
                        filter: this.bypt ? "1,61" : "-1,-61"
                    }
                })
                    .then(function (response) {
                        reload && (vm.loadingapi = false);
                        vm.logs = response.data['result']['logs'];
                        vm.page = response.data['result']['curr_page'];
                        vm.limit = response.data['result']['limit'];
                        vm.count = response.data['result']['count']
                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err)

                    })

            },
            getavatarsrc(unit_id) {
                if (unit_id > 0) {
                    const urls = util.icon_root + unit_id + "/0.png";
                    return urls
                } else {
                    return util.asset_root + "assets/image/ui/common/com_win_22.png"
                }
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

    .tr-notbypt {
        height: 65px;
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