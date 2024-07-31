import request from '../helpers/request';

export default defineNuxtPlugin((nuxtApp) => {
  // const { $i18n } = useNuxtApp()
  const config = useRuntimeConfig()
  
  return {
    provide: {
      request: request(config.public.api, (body: RequestInit['body'] | Record<string, any> | FormData | undefined) => {
        // let lang_code: string|null = $i18n.localeProperties.value?.code;
        // // lang_code = 'fa'

        // if(typeof body === 'object' && !Array.isArray(body)) {
        //   if(body instanceof Object) {
        //     // @ts-ignore
        //     body.locale = lang_code;
        //   }
        //   // @ts-ignore
        //   else if(body instanceof FormData) {
        //     // @ts-ignore
        //     body.append('locale', lang_code);
        //   }
        // }
        // else if(!body) {
        //   body = {
        //     locale: lang_code
        //   }
        // }
      }),
    },
  };
});