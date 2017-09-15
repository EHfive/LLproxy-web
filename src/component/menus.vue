<template>
    <div>
        <mu-paper class="demo-menu">
            <mu-menu class="mm" :autoWidth="false">
                <mu-menu-item title="个人信息" leftIcon="face" @click="goto('/user/'+getID())"></mu-menu-item>
                <mu-menu-item title="队伍信息" leftIcon="group" @click="goto('/user/'+getID()+'/deck')"></mu-menu-item>
                <mu-menu-item title="社员信息" leftIcon="person" @click="goto('/user/'+getID()+'/units')"></mu-menu-item>
                <mu-divider/>
                <mu-menu-item title="当前活动" inset @click="goto_event()"></mu-menu-item>

                <mu-menu-item title="Live记录" leftIcon="music_note"
                              @click="goto('/user/'+getID()+'/live')"></mu-menu-item>
                <mu-menu-item title="招募记录" leftIcon="mail" @click="goto('/user/'+getID()+'/secretbox')"></mu-menu-item>
                <mu-menu-item title="开箱记录" leftIcon="card_giftcard"
                              @click="goto('/user/'+getID()+'/effortbox')"></mu-menu-item>
                <mu-menu-item title="活动记录" rightIcon="keyboard_arrow_right" inset>
                    <mu-menu-item title="传统活动/Marathon" @click="goto('/user/'+getID()+'/marathon')"></mu-menu-item>
                    <mu-menu-item title="Score Match [未完]" @click="goto('/user/'+getID()+'/battle')"></mu-menu-item>
                    <mu-menu-item title="Medley Fes" @click="goto('/user/'+getID()+'/festival')"></mu-menu-item>
                    <mu-menu-item title="Challenge Fes" @click="goto('/user/'+getID()+'/challenge')"></mu-menu-item>
                    <mu-menu-item title="Loveca LP回复" @click="goto('/user/'+getID()+'/loveca')"></mu-menu-item>
                </mu-menu-item>
            </mu-menu>
        </mu-paper>
    </div>
</template>

<script>
    import bus from '../bus.js'
    import Cookies from 'js-cookie'
    import util from '../util.js'
    export default{
        data(){
            return {
                user_list: {},
                event_type: null,
                error: null
            }
        },

        created () {

            bus.$on('set', (user_list) => {

                this.user_list = user_list

            });
            const vm = this;
            this.loadingevent = true;
            util.eventlistPromise().then(function (result) {
                vm.event_type = result.sltevent_type;
            }).catch(function (e) {
                vm.error = e
            });

        },
        methods: {
            getID (){

                if (this.$route.params.id) {
                    return this.$route.params.id
                } else {
                    const savedlist = Cookies.getJSON('userlist');
                    if (savedlist) {
                        this.user_list = savedlist
                    }
                    for (const k in this.user_list) return k
                }
            },
            goto(path) {
                if (this.$route.path === path) {
                    bus.$emit('refresh')
                } else {
                    this.$router.push(path)
                }
            },
            goto_event(){
                if (this.event_type) {
                    let path = '/user/' + this.getID() + '/';
                    switch (this.event_type) {
                        case 1:
                            path+='marathon';
                            break;
                        case 2:
                            path+='battle';
                            break;
                        case 3:
                            path+='festival';
                            break;
                        case 4:
                            path+='challenge';
                            break;
                    }
                    this.goto(path)
                }
            }
        }
    }
</script>

<style lang="css">
    .demo-menu {
        margin-bottom: 20px;
    }
</style>
