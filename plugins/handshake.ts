
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:created', async () => {
    const { fetchSiteinfo } = useSiteinfo()

    try {
      await fetchSiteinfo();
    } catch (e) {
      console.log(e)
    }
  })
})