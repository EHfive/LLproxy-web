<template>
    <div class="demo-step-container">
        <mu-stepper :activeStep="round-1" :linear="false">
            <mu-step v-for="i in showmax" :key="i">
                <mu-step-button @click="changeStep(i)" :disabled="needdisable(i)">
                    Round. {{i}}
                </mu-step-button>
            </mu-step>
        </mu-stepper>
        <!--<div class="demo-step-content">-->
        <!--<p>-->
        <!--{{content}}-->
        <!--</p>-->
        <!--<div>-->
        <!--<mu-flat-button class="demo-step-button" label="Previous" :disabled="round <= 1" @click="handlePrev"/>-->
        <!--<mu-raised-button class="demo-step-button" label="Next" :disabled="round >= showmax" primary @click="handleNext"/>-->
        <!--</div>-->
        <!--</div>-->
    </div>
</template>

<script>
    export default {
        data () {
            return {
                round: this.roundin
            }
        },
        props: {
            pair:{

            },
            roundin: {
                type: Number,
                default: null
            },
            showmax: {
                type: Number,
                required: true
            },
            lives: {
                type: Array,
                required: true
            },
            allowmax: {
                type: Number,
                default: this.showmax
            },
            showmin: {
                type: Number,
                default: 1
            },
            showbox: {
                type: Array,
                default: null
            }
        },
        created() {
            if (this.round === null) this.round = this.defaultround
        },
        computed: {
            content () {
                let message = ''
                switch (this.round) {
                    case 0:
                        message = '选择Round'
                        break
                    default:
                        message = 'Round. ' + this.round
                        break
                }
                return message
            },
            finished () {
                return this.round > this.showmax
            },
            defaultround(){
                for (let i = this.showmax; i >= 0; i--) {
                    if (!this.needdisable(i)) {
                        return i
                    }
                }
                return 0
            }
        },
        watch: {
            'roundin': "changeround",
            'pair': "dynround"
        },
        methods: {
            handleNext () {
                this.round++
            },
            handlePrev () {
                this.round--
            },
            changeStep (index) {
                this.round = index
            },
            needdisable (curr_round){
                if (this.showbox && this.showbox.length >= this.showmax) {
                    return !this.showbox[curr_round - 1]
                } else {
                    return curr_round > this.allowmax || curr_round < this.showmin
                }
            },
            changround(){
                this.round = this.roundin
            },
            dynround(){
                this.round = this.defaultround
            }
        }
    }
</script>

<style>
    .demo-step-container {
        width: 100%;

        margin: auto;
    }

    .demo-step-content {
        margin: 0 16px;
    }

    .demo-step-button {
        margin-top: 12px;
        margin-right: 12px;
    }
</style>
