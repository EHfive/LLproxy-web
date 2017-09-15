<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
            <!--<pre>{{error}}</pre>-->
        </mu-card>
        <mu-card class="loading" v-else-if="loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="logs" style="padding: 15px 0px">


            <mu-card-title title="Loveca LP回复" :subTitle="asc?'时间顺序':'时间倒序'" style=""></mu-card-title>

            <mu-content-block style="margin-left: 10px">
                <mu-select-field v-model="sltevent" label="选择活动" style="margin-right: 15px">
                    <mu-menu-item :value="0"
                                  title=""
                    ></mu-menu-item>
                    <mu-menu-item v-for="vals,index in eventlist" :key="index" :value="vals.event_id"
                                  :title="vals.title+' /'+vals.event_id"
                    ></mu-menu-item>
                </mu-select-field>
                <br>
                <mu-select-field v-model="groupid" label="最小范围" style="margin-right: 25px">
                    <mu-menu-item v-for="(value,key) in grouplist" :key="key" :value="key"
                                  :title="value.title"
                    ></mu-menu-item>
                </mu-select-field>
                <mu-switch label="切换 时间正序显示" v-model="asc"></mu-switch>
                <br>
                <p style="font-size: 1.2em">合计 : <span>{{sumloveca}}</span></p>
            </mu-content-block>
            <div>
                <mu-table :selectable="false" :showCheckbox="false" :fixedHeader="false" style="min-height: 100px">
                    <mu-thead slot="header">
                        <mu-th class="t-a-center f-size-loveca">
                            时间范围
                        </mu-th>
                        <mu-th class="t-a-center f-size-loveca">
                            合计
                        </mu-th>
                    </mu-thead>
                    <mu-tbody>
                        <mu-tr v-for="log,index in logs" :key="index">
                            <mu-td class="t-a-center f-size-loveca">
                                {{timefmt(log.time_range)}}{{grouplist[groupid].unit}}
                            </mu-td>
                            <mu-td class="t-a-center f-size-loveca-num">
                                {{log.count}}
                            </mu-td>
                        </mu-tr>

                    </mu-tbody>
                </mu-table>
            </div>
        </mu-card>

    </div>
</template>

<script>
    import axios from 'axios'
    import bus from '../bus.js'
    import util from '../util.js'
    const asckey = "loveca_asc";
    export default {
        data(){
            return {
                loadingapi: true,
                logs: null,
                error: null,
                groupid: "day",
                asc: util.getkey(asckey) === 'true',
                sltevent: 0,
                eventlist: [],
                grouplist: {
                    "minute":{
                        title:"分钟",
                        fmt: "%Y-%m-%d %H:%i",
                        unit: ""
                    },
                    "hour": {
                        title: "小时",
                        fmt: "%Y-%m-%d %H",
                        unit: "时"
                    },
                    "day": {
                        title: "日",
                        fmt: "%Y-%m-%d",
                        unit: " 日"
                    },
                    "mouth": {
                        title: "月",
                        fmt: "%Y-%m",
                        unit: " 月"
                    }
                }
            }
        },
        created () {
            const vm = this;

            util.eventlistPromise().then(function (result) {
                vm.eventlist = result.event_list;
                vm.sltevent = result.sltevent;
                vm.loadingevent = false
            }).catch(function () {
                vm.sltevent = util.selectevent(vm.eventlist);
                vm.loadingevent = false
            });
//            this.fetchData(true);
            bus.$on('refresh', () => {

                this.fetchData()

            })
        },
        watch: {

            '$route': 'fetchData',
            'asc': 'handleasc',
            'groupid': 'handgroupid',
            'sltevent': 'fetchData'
        },
        computed: {
            sumloveca(){
                let sum = 0;
                if (this.logs) {
                    for (let log of this.logs) {
                        sum += log.count
                    }
                }
                return sum
            }
        },
        methods: {
            handleasc (){
                this.logs.reverse();
                util.setkey(asckey, this.asc);
            },
            timefmt(isotime){
                return isotime.replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ")
            },
            handgroupid(){
                this.loadingapi = false;
                this.fetchData(false)
            },
            currevent(){
                if (!this.sltevent) return null
                for (var event of this.eventlist) {
                    if (event.event_id == this.sltevent) {
                        return event
                    }
                }
                return null
            },
            fetchData (reload = true) {

                reload && (this.loadingapi = true);
                const vm = this;
                vm.logs = [];
                const event = this.currevent();
                axios.get(util.api_server + 'llproxy/lovecaRecovery/', {
                    params: event ? {
                        uid: vm.$route.params.id,
                        begin: event.begin.timestamp,
                        end: event.end.timestamp,
                        group: vm.grouplist[vm.groupid].fmt
                    } : {
                        uid: vm.$route.params.id,
                        group: vm.grouplist[vm.groupid].fmt
                    }
                })
                    .then(function (response) {
                        vm.loadingapi = false;
                        vm.logs = response.data.result.logs;
                        vm.asc && vm.logs.reverse()

                    })
                    .catch(function (err) {
                        vm.loadingapi = false;
                        this.error = err.toString();
                        console.log(err)

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

    .t-a-center {
        text-align: center;
    }

    .f-size-loveca {
        font-size: 1.12em;
        height: 60px;
    }

    .f-size-loveca-num {
        font-size: 1.3em;
        height: 60px;
    }

</style>