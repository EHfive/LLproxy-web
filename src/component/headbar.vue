<template>
    <div>
        <mu-appbar title="LLproxy" style="overflow: hidden" fullwidth>
            <mu-icon-button icon="menu" @click="toggle()" slot="left"></mu-icon-button>

            <mu-avatar slot="right" class="appbar-avatar"
                       :src="getavatarsrc(avatar_unit)"></mu-avatar>
               <mu-auto-complete icon="search" class="appbar-auto-complete" hintText="UID/邀请ID/昵称"
                                 v-model.trim="val" slot="right"
                                 @input="handleInput" @keydown.enter="search()" @change="search()" filter="noFilter"
                                 :dataSource="dataSource" openOnFocus></mu-auto-complete>


        </mu-appbar>
        <mu-drawer :open="open" @close="toggle()" :docked="false">
            <mu-appbar title="选项" fullwidth></mu-appbar>

            <mu-menu :value="menuval">
                <mu-menu-item style="margin-bottom: 25px" title="关于" @click="goto('/user/')"></mu-menu-item>
                <!--<mu-menu-item title="User:同学失格/865384" @click="goto('/user/865384')"></mu-menu-item>-->
                <!--<mu-menu-item title="User:Cimoc/5012675" @click="goto('/user/5012675')"></mu-menu-item>-->

                <mu-menu-item v-for="user,index in user_list" :key="index" :title="'-> '+user.name+'/'+user.uid"
                              @click="goto('/user/'+user.uid)"></mu-menu-item>
                <mu-menu-item title="清除账号" @click="cleancookie()"></mu-menu-item>
                <mu-menu-item style="margin-top: 25px" title="关闭侧栏" @click="toggle()"></mu-menu-item>

            </mu-menu>

        </mu-drawer>
    </div>
</template>

<script>
    import axios from 'axios'
    import debounce from 'lodash/debounce'
    import bus from '../bus.js'
    import Cookies from 'js-cookie'
    import util from '../util.js'

    export default {
        data () {
            return {
                menuval: 'user/aa',
                dataSource: [],
                val: null,
                open: false,
                savedlist: null,
                user_list: {},
                avatar_unit: null
            }
        },
        created () {
            this.defaultlist = {
                '865384': {
                    uid: 865384,
                    name: "示例账号1",
                    invite_code: "113918799"
                },
                '5012675': {
                    uid: 5012675,
                    name: "示例账号2",
                    invite_code: "493814939"
                }
            };
            this.savedlist = Cookies.getJSON('userlist');
            if (this.savedlist) {
                this.user_list = this.savedlist
            } else {
                this.user_list = this.defaultlist
            }

            bus.$on('add', (userinfo) => {
                if (!this.savedlist) {
                    this.user_list = {};
                }
                this.user_list['' + userinfo.uid] = userinfo;
                this.savedlist = this.user_list;
                bus.$emit('set', this.user_list);
                Cookies.set('userlist', this.user_list, {expires: 365})
            });
            bus.$on('update', (userinfo) => {
                if (this.savedlist && this.user_list.hasOwnProperty('' + userinfo.uid)) {
                    this.user_list['' + userinfo.uid] = userinfo;
                    this.savedlist = this.user_list;
                    bus.$emit('set', this.user_list);
                    Cookies.set('userlist', this.user_list, {expires: 365})
                }
                this.avatar_unit = userinfo.navi_unit_info
            })
        },
        mounted(){
            bus.$emit('set', this.user_list);
            for (const x in this.user_list) {
                this.avatar_unit = this.user_list[x]['navi_unit_info'];
                break
            }
        },
        methods: {
            cleancookie(){
                Cookies.remove('userlist');
                this.savedlist = null;
                this.avatar_unit = null;
                this.user_list = this.defaultlist;

                bus.$emit('set', this.user_list);
                this.$router.push('/')
            },
            toggle () {
                this.open = !this.open
            },
            goto(path) {
                this.toggle();
                if(this.$route.path === path){
                    bus.$emit('refresh')
                } else {
                    this.$router.push(path)
                }
            },
            search(){

                this.$router.replace({
                    name: 'search',
                    query: {
                        keyword: this.dataSource.length === 1 ? this.dataSource[0] : this.val
                    }
                })

            },
            handleInput: debounce(function () {
                const vm = this;
                axios.get(util.api_server + 'llproxy/userSearch/', {
                    params: {
                        keyword: vm.val,
                        limit: 8
                    }
                })
                    .then(function (response) {
                        const res = [];
                        for (const x of response.data['result']) {
                            isContains(x['name'], vm.val) ? res.push(x['name']) : false;
                            isContains(x['uid'].toString(), vm.val) ? res.push(x['uid'].toString()) : false;
                            isContains('' + x['invite_code'], vm.val) ? res.push(x['invite_code']) : false

                        }
                        vm.dataSource = res
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            }, 500),
            getavatarsrc(unit) {
                if (unit && unit['unit_id']) {
                    const urls = util.icon_root + unit['unit_id'] + "/" + (unit['display_rank'] - 1) + ".png";
                    return urls
                } else {
                    return util.asset_root + "assets/image/ui/common/com_win_22.png"
                }
            }


        },
    }
    function isContains(str, substr) {
        return new RegExp(substr).test(str);
    }
</script>
<style lang="less">

    .appbar-auto-complete {
        color: #FFF;
        margin-bottom: -13px;
        margin-right: 20px;
        &.focus-state {
            color: #FFF;
        }
        .mu-text-field-icon {
            color: #FFF;
        }
        .mu-text-field-hint {
            color: fade(#FFF, 54%);
        }
        .mu-text-field-input {
            color: #FFF;
        }
        .mu-text-field-focus-line {
            background-color: #FFF;
        }
    }

    /*phone*/
    @media screen and (max-width: 600px) {

        .appbar-auto-complete {
            width: 150px;
        }
    }

    /*tablet*/
    @media screen and (min-width: 600px) and (max-width: 1100px) {
        .appbar-auto-complete {
            width: auto;
        }
    }

    /*PC*/
    @media screen and (min-width: 1100px) {

        .appbar-auto-complete {
            width: auto;
        }
    }

    @media screen and (min-width: 1275px) {

        .appbar-auto-complete {
            width: auto;
        }
    }

    .appbar-avatar {

    }
    .iconcl {
        margin: 0;
        padding: 0;
    }
</style>