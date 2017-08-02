<template>
    <div ref="skillimg" class="demo-icon-tip" @mouseenter="handleHover" @mouseleave="handleHoverExit">
        <img  :src="src" :alt="desc" :class="iconClass">
        <mu-tooltip :label="desc" :show="show"  :trigger="$refs.skillimg" :touch="touch" :verticalPosition="verticalPosition" :horizontalPosition="horizontalPosition"></mu-tooltip>
    </div>
</template>
<script>
    import util from '../util.js'

    export default {
        date (){
            return {
                show: false,

            }
        },

        props: {
            src: {
                type: String,
                default: "https://rawfile.loveliv.es/assets/image/ui/common/com_etc_68.png"
            },
            desc: {
                type: String,
                default: "学园偶像技能"
            },
            touch: {
                type: Boolean,
                default: false
            },
            verticalPosition:{
                type: String,
                default: 'top'
            },
            horizontalPosition: {
                type: String,
                default: 'center'
            },
            iconClass :{
                type: String,
                default: ''
            }
        },
        methods: {
            handleHover () {
                this.show = true
            },
            handleHoverExit () {
                this.show = false
            }
        }
    }
</script>
<style>
    .demo-icon-tip{
        display: inline-block;
        cursor: default;
        position: relative;
    }
</style>