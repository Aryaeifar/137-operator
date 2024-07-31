import flashMessage from '../helpers/flashMessage';
import VueFlashMessage from '@smartweb/vue-flash-message';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const flashMsgConfig = config.public?.flashMessage

  nuxtApp.vueApp.use(VueFlashMessage, {
    // @ts-ignore
    time: flashMsgConfig?.time ?? 5000,
    strategy: flashMsgConfig?.strategy ?? 'single'
  })

  const $flashMessage = nuxtApp.vueApp.config.globalProperties.$flashMessage;
  // @ts-ignore
  nuxtApp.provide('flashMsg', flashMessage($flashMessage, flashMsgConfig));
});