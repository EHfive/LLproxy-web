<template>
    <div>
        <mu-card style="overflow: hidden">
            <mu-card-header title="大众脸的同学" subTitle="eh5, cimoc">
                <mu-avatar src="https://gss0.baidu.com/7Ls0a8Sm2Q5IlBGlnYG/sys/portraitl/item/f0cb27af?t=1494442107"
                           slot="avatar"/>
            </mu-card-header>
            <mu-divider shallowInset></mu-divider>

            <mu-card-title title="这是什么?" subTitle=" LLproxy"/>
            <mu-card-text>
                这是 <a href="http://ll.sdo.com" target="_blank">LoveLive! 学园偶像祭 (国服)</a> 的数据收集应用
                <br>
                目前可以收集 个人信息, 卡组信息, LIVE、活动记录, 招募、开箱记录，并提供反汉化补丁
                <br> 也可以把它当成游戏代理使用(上海)
                <br>

            </mu-card-text>


            <mu-card-title title="使用方法" subTitle="设置 DNS"/>
            <mu-card-text>
                将 游戏设备 的首选DNS 设为
                <!--<a style="margin-left: 15px" target="_blank"><mu-chip  color="redA200" backgroundColor="red50">182.254.150.248</mu-chip></a> <span style="margin-left: 15px">( 仅WIFI /LAN )</span>-->
                <mu-chip color="redA200" backgroundColor="red50">182.254.150.248</mu-chip>
                (兼容my.llsif.win)
                <br> <span class="mt8">关闭游戏后台并重新进入游戏,若接入成功可在 其他-帮助 下看到"已接入LLproxy" 界面</span> <br>

                <span class="mt8">然后就可以在右上的搜索框搜到自己了</span><br><br>
                <span class="mt8">仍然不行请试试 <a target="_blank" href="http://cos.sokka.cn//apk/DNS_Changer.apk">DNS Changer(安卓)</a>, <a target="_blank" href="https://itunes.apple.com/cn/app/dns-override/id1060830093?mt=8">DNS Override(IOS) 功能收费</a></span>
                <br><span class="mt8">如果有条件改hosts 请加群咨询 IP-主机名</span>
                <br>
                <!--<span><a class="link" href="https://llsif.sokka.cn/llproxy/ca.crt">预备的CA证书 目前版本无需</a></span>-->
            </mu-card-text>
            <mu-card-title title="怎么称呼它?" subTitle=""/>
            <mu-card-text style="margin-bottom: 20px">
                LLproxy
                <br>缩写为PLL  (区别LLP)
                <br>请通过 <a onfocus="this.blur()" href="//pll.sokka.cn" target="_blank">pll.sokka.cn</a> 或 <a
                    href="//aqours.tech" target="_blank">aqours.tech</a> 访问
                <br>联系我:在贴吧 @大众脸的同学 或邮至 cimoc@sokka.cn 即可
                <br>为加快故障处理及增进交流 请加QQ群吧: <a target="_blank"
                                        href="//shang.qq.com/wpa/qunwpa?idkey=620795ea4927bedcd6cfd48c571797e466c4d8cdfc26bdf69b419dcca64fb449">467474697</a>

            </mu-card-text>
            <mu-card-title title="反汉化"/>
            <mu-card-text>
                LLproxy用户 在SIF中 重复按 其他-各种设置-下载 的 演唱会歌曲(全部)  2 或 3 次 获取补丁 <br>
                新增了帮助界面 其他-帮助 可选择开关歌曲名替换及查看反汉化补丁状态
                <br>
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