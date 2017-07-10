<template>
    <div>
        <mu-card style="overflow: hidden">
            <mu-card-header title="大众脸的同学" subTitle="cimoc">
                <mu-avatar src="https://gss0.baidu.com/7Ls0a8Sm2Q5IlBGlnYG/sys/portraitl/item/f0cb27af?t=1494442107"
                           slot="avatar"/>
            </mu-card-header>
            <mu-divider shallowInset></mu-divider>
            <mu-card-title title="反洒脱补丁!" />
            <mu-card-text>
                此为 完善版反汉化补丁 by eh5 <br>
                LLproxy 用户在游戏中 其他-各种设置-下载-演唱会歌曲(全部) 即可获取补丁 <br>
                我们进行了反汉化包的版本管理,故不会对正常的更新造成影响,并且可还原 <br>
                为加快故障处理及增进交流 请加QQ群吧: <a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=620795ea4927bedcd6cfd48c571797e466c4d8cdfc26bdf69b419dcca64fb449">467474697</a> <br>
            </mu-card-text>
            <mu-card-title title="这是什么?" subTitle=" LLproxy"/>
            <mu-card-text>
                这是 <a href="http://ll.sdo.com" target="_blank">LoveLive! 学园偶像祭 (国服)</a> 的数据收集应用
                <br>
                目前可以收集 个人信息, 卡组信息, LIVE、活动记录, 招募、开箱记录，并提供反汉化补丁
                <br> 也可以把它当成游戏代理使用(上海)
                <br>

            </mu-card-text>


            <mu-card-title title="食用方法" subTitle="设置 DNS"/>
            <mu-card-text>
                将 游戏设备 的首选DNS 设为
                <!--<a style="margin-left: 15px" target="_blank"><mu-chip  color="redA200" backgroundColor="red50">182.254.150.248</mu-chip></a> <span style="margin-left: 15px">( 仅WIFI /LAN )</span>-->
                <mu-chip color="redA200" backgroundColor="red50">182.254.150.248</mu-chip>
                (兼容my.llsif.win)
                <br> <span class="mt8">关闭游戏后台并重新进入游戏</span> <br>

                <span class="mt8">如果DNS设置正确就可以在右上的搜索框搜到自己了</span>
                <br>
                <span>
                    <a class="link" href="https://llsif.sokka.cn/llproxy/ca.crt">预备的CA证书 目前版本无需</a></span>
            </mu-card-text>
            <mu-card-title title="怎么称呼它?" subTitle=""/>
            <mu-card-text style="margin-bottom: 20px">
                LLproxy
                <br>缩写为PLL  (区别LLP)
                <br>请通过 <a onfocus="this.blur()" href="//pll.sokka.cn" target="_blank">pll.sokka.cn</a> 或 <a
                    href="//aqours.tech" target="_blank">aqours.tech</a> 访问
                <br>联系我:在贴吧 @大众脸的同学 或邮至 cimoc@sokka.cn 即可
            </mu-card-text>

        </mu-card>
    </div>
</template>

<style>
    .mt8 {
        margin-top: 18px;
    }

    .link {
        font-size: smaller;
    }

</style>