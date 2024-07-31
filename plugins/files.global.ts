import Files from '~/helpers/files';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const files = new Files(config.public);
  // nuxtApp.provide('files', files);
  return {
    provide: {
      files,
    },
  };
});