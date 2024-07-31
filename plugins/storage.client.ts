
import { storage } from 'hemend-js-library'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  // nuxtApp.provide('storage', storage(config.public.storage));

  return {
    provide: {
      storage: storage(config.public.storage),
    },
  };
});