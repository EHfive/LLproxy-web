<template>
    <div>
        <mu-paper class="demo-menu" >
            <mu-menu  class="mm" :autoWidth="false">
                <mu-menu-item title="个人信息" leftIcon="face" @click="goto('/user/'+getID())"></mu-menu-item>
                <mu-menu-item title="队伍信息" leftIcon="group" @click="goto('/user/'+getID()+'/deck')"></mu-menu-item>
                <mu-menu-item title="社员信息" leftIcon="person" @click="goto('/user/'+getID()+'/units')"></mu-menu-item>
                <mu-divider />
                <mu-menu-item title="Live记录" leftIcon="music_note" @click="goto('/user/'+getID()+'/live')"></mu-menu-item>
                <mu-menu-item title="招募记录" leftIcon="mail" @click="goto('/user/'+getID()+'/secretbox')"></mu-menu-item>
                <mu-menu-item title="开箱记录" leftIcon="card_giftcard" @click="goto('/user/'+getID()+'/effortbox')"></mu-menu-item>
                <mu-menu-item title="活动记录"  rightIcon="keyboard_arrow_right" inset>
                    <mu-menu-item title="传统活动/Marathon" @click="goto('/user/'+getID()+'/marathon')"></mu-menu-item>
                    <mu-menu-item title="Medley Fes" @click="goto('/user/'+getID()+'/festival')"></mu-menu-item>
                    <mu-menu-item title="Challenge Fes" @click="goto('/user/'+getID()+'/challenge')"></mu-menu-item>
                    <mu-menu-item title="Score Match"></mu-menu-item>
                </mu-menu-item>
            </mu-menu>
        </mu-paper>
    </div>
</template>

<script>
    import bus from '../bus.js'
    import Cookies from 'js-cookie'
    export default{
        data(){
            return {
                user_list:{}
            }
        },

        created () {

            bus.$on('set', (user_list) => {

                this.user_list = user_list

            })

        },
        methods:{
            getID (){

                if(this.$route.params.id){
                    return this.$route.params.id
                } else {
                    const savedlist = Cookies.getJSON('userlist');
                    if (savedlist) {
                        this.user_list = savedlist
                    }
                    for(const k in this.user_list) return k
                }
            },
            goto(path) {
                if(this.$route.path === path){
                    bus.$emit('refresh')
                } else {
                    this.$router.push(path)
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
