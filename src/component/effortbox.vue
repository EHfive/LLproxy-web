<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
            <!--<pre>{{error}}</pre>-->
        </mu-card>
        <mu-card class="loading" v-else-if="loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="logs && passet" style="padding: 15px 0px">
            <!--<mu-card-header title="Myron Avatar" subTitle="sub title">-->
            <!--<mu-avatar src="/images/uicon.jpg" slot="avatar"/>-->
            <!--</mu-card-header>-->

            <mu-card-title title="奖励箱" subTitle="live 奖励宝箱" style=""></mu-card-title>

            <mu-content-block style="margin-left: 10px">
                <mu-switch label="洒脱一下" v-model="satuo"></mu-switch>
            </mu-content-block>
            <div>
                <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="true"
                          :height="(logs.length>=10 || page>1)  ?'560px':'auto'">
                    <mu-thead slot="header">
                        <mu-th class="wtcardpool">奖励箱类型
                        </mu-th>
                        <mu-th>1</mu-th>
                        <mu-th>2</mu-th>
                        <mu-th>3</mu-th>

                    </mu-thead>
                    <mu-tbody>
                        <mu-tr v-for="log,index in logs" :key="index">
                            <mu-td class="wtcardpool ht70" style="text-align: center;">
                                <span style="font-size: 125%">{{('' + log.capacity).slice(0, -4) + ' W'}}</span>
                                <br><span
                                    style="font-size: 85%">{{ log['update_time'].replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ").slice(0, -3)}}</span>
                            </mu-td>
                            <mu-td class="ht70" v-for="n in 3" :key="n-1">
                                <template v-if="log.rewards[n-1]">
                                    <img :src="getavatarsrc(log.rewards[n-1].item_id)"
                                         v-if="log.rewards[n-1].type==1001" style="max-width: 40px;">
                                    <img v-else="" class="skill"
                                         :src="util.asset_root +(log.rewards[n-1].asset || passet[''+log.rewards[n-1].type])">
                                    <span v-if="satuo">{{log.rewards[n - 1].name.replace('Smile', '甜美').replace('Pure', '清纯').replace('Cool', '洒脱')}}</span>
                                    <span v-else>{{log.rewards[n - 1].name.replace('甜美', 'Smile').replace('清纯', 'Pure').replace('洒脱', 'Cool')}}</span>

                                    <span
                                            v-if="log.rewards[n-1].amount>1"> x{{log.rewards[n - 1].amount}}</span>
                                </template>
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
    import bus from '../bus.js'
    import util from '../util.js'

    export default {
        data(){
            return {
                loadingapi: false,
                logs: null,
                page: 1,
                limit: 10,
                count: null,
                error: null,
                satuo: false,
                showr: false,
                notshown: false,
                passet: null,
                util:util
            }
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData()
            bus.$on('refresh', () => {

                this.fetchData()

            })
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
                axios.get(util.api_server + 'llproxy/effortBoxLog/', {
                    params: {
                        uid: vm.$route.params.id,
                        limit: vm.limit,
                        page: vm.page,
//                        filter: this.bypt ? "1,61" : "-1,-61"
                    }
                })
                    .then(function (response) {
                        reload && (vm.loadingapi = false);
                        vm.logs = response.data['result']['boxs'];
                        vm.passet = response.data['result']['pub_asset'];
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
        height: 70px !important;
        white-space: normal;
    }

    .mu-th {
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

        .ht70 {
            height: 60px ;
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

    .skill {
        max-width: 25px;
    }
</style>