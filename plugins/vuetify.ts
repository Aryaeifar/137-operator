import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import '@fortawesome/fontawesome-free/css/all.css'
import { aliases, fa } from 'vuetify/iconsets/fa'
const myCustomLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    // transparent:'#00FFFFFF',
    // Primary
    white:'#ffffff',
    'white-d':'#F6F7F9',
    dark:'#000000',
    pri:'#00A58F',
    'pri-l':'#3BE0CA',
    'pri-d':'#007767',
    'pri-l-l':'#17AAA4',
    'pri-l-l-l': '#A8F2E8',
    // Secondary
    sec:'#F2A222',
    'sec-l':'#FFDA9F',
    'sec-d':'#A56600',
    'sec-l-l': '#FFC05D',

    // Neutral
    neu:'#EDF2F1',
    'neu-g-l':'#DFDFDF',
    'neu-g':'#8EA59F',
    'neu-d': '#181C1B',

    // Negative accent
    'neg-acc':'#E03B51',
    'neg-acc-l':'#FF8091',
    'neg-acc-d':'#A50016',
    'neg-acc-l-l': '#FFBEC7',

    // Complementory
    com:'#8140F2',
    'col-l':'#AF80FF',
    'col-d':'#3D00A5',
    'com-l-l': '#CCAEFF',

    aux:'#E07956',
    'aux-l':'#FFA080',
    'aux-d':'#A52900',

    auxx:'#F2EF23',
    'auxx-l':'#FFFD80',
    'auxx-d':'#E0DC00',

    yes:'#8EE000',

    no:'#F22323',
    'no-d':'#E00000',

    'pos-acc':'#00BC16',
    'pos-acc-l':'#43FF59',
    'pos-acc-d':'#00770E',

    comm:'#1B58BC',
    'com-l':'#5A99FF',
    'com-d':'#002E77',

  },
}
export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    directives,
    components: {
      ...components,
      VSkeletonLoader,
    },
    theme: {
      defaultTheme: 'myCustomLightTheme',
      themes: {
        myCustomLightTheme,
      },
    },
    icons: {
      defaultSet: 'fa',
      aliases,
      sets: {
        fa,
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})