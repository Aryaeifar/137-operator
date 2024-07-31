import 'hemend-js-library/lib/require'

export default defineNuxtPlugin((nuxtApp) => {
    const pathNotChanged = ref(false)
    nuxtApp.$router.afterEach((to: any, from: any) => {
        pathNotChanged.value = false
        if(from && to && from.path === to.path) {
            pathNotChanged.value = true
        }
    })

    nuxtApp.vueApp.use({
        //@ts-ignore
        install(app: any, options: any) {
            app.mixin({
                methods: {
                    isChangedPath() {
                        return !pathNotChanged.value
                    }
                },
            })
        }
    })
});