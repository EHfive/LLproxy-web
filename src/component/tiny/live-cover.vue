<template>
    <div class="inline-demo">

        <canvas ref="coverdraw" class="auto-img" width="272px" height="272px"></canvas>
        <img @load="ranpicloaded=true" ref="ranpic" :src="util.asset_root+'assets/image/ui/live/l_win_30.png'" hidden>
        <img @load="sis1loaded=true" ref="sis1" :src="util.asset_root+'assets/image/idol_skill/sis001_01.png'" hidden>
        <img @load="sis2loaded=true" ref="sis2" :src="util.asset_root+'assets/image/idol_skill/sis002_01.png'" hidden>
        <img @load="sis3loaded=true" ref="sis3" :src="util.asset_root+'assets/image/idol_skill/sis003_01.png'" hidden>
        <img @load="coverloaded=true" ref="cover" :src="src" hidden>


    </div>
</template>

<script>
    //http://jp-r.sokka.cn/assets/image/ui/live/l_win_30.png
    // util.asset_root+'assets/image/ui/live/l_win_30.png'
    import util from '../../util.js'
    export default {
        data (){
            return {
                util: util,
                coverloaded: false,
                sis1loaded: false,
                sis2loaded: false,
                sis3loaded: false,
                ranpicloaded: false
            }
        },
        props: {
            src: {
                type: String
            },
            randomlive: {
                type: Boolean,
                "default": false
            },
            attr: {},
            sisSize: {
                type: Number
            }

        },
        computed: {
            allloaded(){
                return this.coverloaded && this.sis1loaded && this.sis2loaded && this.sis3loaded && this.ranpicloaded
            }
        },
        mounted(){
            this.drawcanvas()
        },
        watch: {
            'src': 'drawcanvas',
            'allloaded': 'drawcanvas'
        },
        methods: {
            drawcanvas(){
                let canvas = this.$refs.coverdraw;
                let cover = this.$refs.cover;
                let ranpic = this.$refs.ranpic;
                let size = this.sisSize || 50

                let ctx = canvas.getContext('2d');
                if (this.randomlive) {
                    ctx.drawImage(
                        cover,
                        this.drawp(canvas, cover, 'width'),
                        this.drawp(canvas, cover, 'height')
                    );
                    ctx.drawImage(
                        ranpic,
                        this.drawp(canvas, ranpic, 'width'),
                        this.drawp(canvas, ranpic, 'height')
                    );
                    (this.attr > 0 && this.attr < 4) && ctx.drawImage(
                        this.$refs['sis' + this.attr],
                        2,
                        canvas.height - size - 2,
                        size,size
                    )
                } else {
                    ctx.drawImage(
                        cover,
                        0, 0,
                        canvas.width, canvas.height
                    );
                    (this.attr > 0 && this.attr < 4) && ctx.drawImage(
                        this.$refs['sis' + this.attr],
                        canvas.width - size - 2,
                        canvas.height - size - 2,
                        size,size
                    )
                }


            },
            drawp(canvas, img, way){
                return Math.round((canvas[way] - img[way]) / 2)
            }
        },

    }
</script>
<style>
    .auto-img {
        width: 100%;
        height: 100%;
        max-width: 100%;
        display: block;
    }

    .inline-demo {
        /*display: block;*/
        /*overflow-x: auto;*/
    }

    /*canvas { border: 1px solid black; }*/

</style>