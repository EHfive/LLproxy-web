<template>
    <mu-tabs :value="theme" @change="changeTheme">
        <mu-tab title="LIGHT (DEFAULT)" value="light"/>
        <mu-tab title="DARK" value="dark"/>
        <mu-tab title="CARBON" value="carbon"/>
        <mu-tab title="TEAL" value="teal"/>
    </mu-tabs>
</template>
<script>
    import light from '!raw-loader!muse-ui/dist/theme-default.min.css'
    import dark from '!raw-loader!muse-ui/dist/theme-dark.min.css'
    import carbon from '!raw-loader!muse-ui/dist/theme-carbon.min.css'
    import teal from '!raw-loader!muse-ui/dist/theme-teal.min.css'
    import bus from '../bus.js'
    export default {
        data () {
            return {
                theme: 'light',
                id: 0,
                themes: {
                    light,
                    dark,
                    carbon,
                    teal
                }
            }
        },
        created(){
            bus.$on("changetheme", (id) => {
                console.log(id)
                switch (id % 4) {
                    case 0:
                        this.changeTheme('light');
                        break;
                    case 1:
                        this.changeTheme('dark');
                        break;
                    case 2:
                        this.changeTheme('teal');
                        break;
                    case 3:
                        this.changeTheme('carbon');
                        break;
                    default: {
                        this.changeTheme('carbon');
                        id=3
                    }
                }
                localStorage.setItem('pll-theme', id % 4)

            })
            bus.$emit('changetheme')
        },
        methods: {
            changeTheme (theme) {
                this.theme = theme
                const styleEl = this.getThemeStyle()
                styleEl.innerHTML = this.themes[theme] || ''

            },
            getThemeStyle () {
                const themeId = 'muse-theme'
                let styleEl = document.getElementById(themeId)
                if (styleEl) return styleEl
                styleEl = document.createElement('style')
                styleEl.id = themeId
                document.body.appendChild(styleEl)
                return styleEl
            }
        }
    }
</script>
