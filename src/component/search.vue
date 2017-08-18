<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
            <!--<pre>{{error}}</pre>-->
        </mu-card>
        <mu-card class="loading" v-else-if="loading">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="users" style="padding: 15px 0px">
            <mu-card-title title="搜索用户" subTitle="仅被收录的" style=""></mu-card-title>
            <div>
                <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="false"
                          :height="users.length?'400px':'70px'">
                    <mu-thead slot="header">
                        <mu-th>加入左侧</mu-th>
                        <mu-th class="mt-avatar">Avatar</mu-th>
                        <mu-th>昵称</mu-th>
                        <!--<mu-th>Rank.</mu-th>-->
                        <mu-th>UID</mu-th>
                        <mu-th class="mt-invite">邀请ID</mu-th>

                        <mu-th v-if="$route.query.showdate">最后更新</mu-th>
                    </mu-thead>
                    <mu-tbody>
                        <mu-tr v-for="user,index in users" :key="index">
                            <mu-td>

                                <!--<mu-float-button icon="add" secondary mini class="demo-float-button"/>-->
                                <mu-icon-button icon="add" class="add-b" @click="add_user(user)"></mu-icon-button>
                            </mu-td>
                            <mu-td class="mt-avatar cursor-pointer" @click="goto_user(user['uid'])">

                                <mu-badge class="demo-badge-content" circle color="redA100"
                                          v-if="user['navi_unit_info']" :content="''+user['navi_unit_info']['level']">
                                    <mu-avatar :src="getavatarsrc(user['navi_unit_info'])" :size="50"></mu-avatar>
                                </mu-badge>
                                <mu-badge class="demo-badge-content" v-else>
                                    <mu-avatar :src="getavatarsrc(false)" :size="50"></mu-avatar>
                                </mu-badge>
                            </mu-td>
                            <mu-td class="cursor-pointer" @click="goto_user(user['uid'])">{{user['name']}}
                                <br>Rank. {{user['level']}}
                            </mu-td>
                            <mu-td class="cursor-pointer" @click="goto_user(user['uid'])">{{user['uid']}}</mu-td>
                            <!--<mu-td>{{user['level']}}</mu-td>-->
                            <mu-td class="cursor-pointer mt-invite" @click="goto_user(user['uid'])">
                                {{user['invite_code']}}
                            </mu-td>

                            <mu-td v-if="$route.query.showdate">
                                {{user['insert_date'].replace('201', "1").replace("T", " ").slice(0, -3)}}
                            </mu-td>

                        </mu-tr>
                    </mu-tbody>

                </mu-table>
                <mu-card-text v-if="users.length <=0 ">

                    <br>
                    <p style="text-align: center;font-size: medium">未搜索到相应用户, 请检查是否正确接入</p>
                </mu-card-text>
            </div>
        </mu-card>
        <mu-popup position="top" :overlay="false" popupClass="demo-popup-top" :open="topPopup">
            加入成功,点击左上按钮查看
        </mu-popup>
    </div>
</template>

<script>
    import axios from 'axios'
    import  bus  from '../bus.js'
    import util from '../util.js'

    export default {
        data(){
            return {
                loading: true,
                users: null,
                page: 1,
                limit: 20,
                count: null,
                error: null,
                topPopup: false,
            }
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData()
            bus.$emit('setnavi', null)
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData',
            topPopup (val) {
                if (val) {
                    setTimeout(() => {
                        this.topPopup = false
                    }, 2000)
                }
            }
        },

        methods: {
            goto_user(uid){
                this.$router.push("/user/" + uid)
            },
            add_user(userinfo){
                bus.$emit('add', userinfo)
                this.topPopup = true
            },
            fetchData (reload = true) {
                this.error = this.users = null;
                reload && (this.loading = true);
                // replace getPost with your data fetching util / API wrapper
                const vm = this;
                axios.get(util.api_server + 'llproxy/userSearch/', {
                    params: {
                        keyword: vm.$route.query.keyword ? vm.$route.query.keyword : "***",
                        limit: 10
                    }
                })
                    .then(function (response) {
                        reload && (vm.loading = false);
                        vm.users = response.data['result'];
                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err)

                    })

            },
            getavatarsrc(unit) {
                if (unit && unit['unit_id']) {
                    const urls = util.icon_root + unit['unit_id'] + "/" + (unit['display_rank'] - 1) + ".png";
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

    .add-b {
        color: #424242;
    }

    .demo-popup-top {
        width: 100%;
        opacity: .8;
        height: 48px;
        line-height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 375px;
    }

    .mu-td, .mu-th {
        padding-left: 16px;
        padding-right: 5px;
        height: 70px;
        white-space: normal;
    }

    .livetable {
        width: 100%;
    }

    .mt-avatar {
        padding-left: 1px;
        padding-right: 20px;
    }

    .cursor-pointer {
        cursor: pointer;
        height: 70px;
    }
</style>