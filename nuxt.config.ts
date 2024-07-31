
import 'hemend-js-library/dist/require'
import { Dirent } from 'fs'

const { join, dirname, basename } = require('path')
const { copySync, removeSync, readdirSync, readFileSync, writeFileSync } = require('fs-extra')

const publicDir = join(dirname(dirname(dirname(__dirname))), 'public');

const theme = basename(__dirname);
const section = basename(dirname(__dirname));
const themePath = join('themes', section, theme);
const themeUrl = '/' + themePath.replace(/\\/g, '/');
const themeAssetsPath = join(themePath, 'assets');
const themeAssetsUrl = '/' + themeAssetsPath.replace(/\\/g, '/');
const publicThemeDir = join(publicDir, themePath);
const publicThemeAssetsDir = join(publicDir, themeAssetsPath);

const API_URL = (process.env.NODE_ENV === 'development' ? process.env.DEV_API_URL : process.env.API_URL) as string;
const DEV_API_FILES_URL = (process.env.NODE_ENV === 'development' ? process.env.DEV_API_FILES_URL : process.env.API_FILES_URL) as string;
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  
  ssr: false,
  
  srcDir: __dirname,

  app: {
    baseURL: '/admin/',
    buildAssetsDir: themeAssetsUrl,
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' }  
  },
  head:{
      title: 'سامانه 137',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
  },
  build: {
    transpile: ['vuetify', {rtl:true}] ,
  },

  css: [
    '@/assets/scss/app.scss','vuetify/lib/styles/main.sass'
  ],
  
  modules: ['@nuxtjs/i18n'],
  
  i18n: {
    lazy: true,
    langDir: './locales',
    strategy: 'prefix_except_default',// prefix
    defaultLocale: 'fa',
    locales: [
      {
        "code": "en",
        "name": "English",
        "dir": "ltr",
        "iso": "en-US",
        "file": "en.json"
      }, {
        "code": "fa",
        "name": "فارسی",
        "dir": "rtl",
        "iso": "fa-IR",
        "file": "fa.json"
      }
    ],
  },

  runtimeConfig: {
    public: {
      files: {
        storage_url: DEV_API_FILES_URL
      },
      storage: {
        prefix: '137_operator',
        driver: 'local',
        ttl: 0
      },
      api: {
        url: API_URL
      },
      flashMessage: {
        rtl: true,
        time: 5000,
        strategy: 'multiple',
        position: 'left bottom'
      }
    }
  },

  hooks: {
    close(nuxt: any) {
      // Copy dist files to public/themes
      if (nuxt.options.dev === false && nuxt.options.ssr === false && nuxt.options._generate) {
        const indexFilePath = join(publicThemeDir, 'index.html');
        const distDir = nuxt.options.nitro?.output?.publicDir || nuxt.options.nitro?.output?.dir || join(__dirname, '.output', 'public')

        removeSync(publicThemeDir)
        copySync(join(distDir, themeAssetsPath), publicThemeAssetsDir)
        copySync(join(distDir, '200.html'), join(publicThemeDir, 'index.html'))
        readdirSync(distDir, {withFileTypes: true}).forEach((dirent: Dirent) => {
          if(dirent.isFile() && !['200.html', 'index.html'].includes(dirent.name)) {
            copySync(join(distDir, dirent.name), join(publicThemeDir, dirent.name))
          } else if(dirent.isDirectory() && !['themes'].includes(dirent.name)) {
            copySync(join(distDir, dirent.name), join(publicThemeDir, dirent.name))
          }
        });
        removeSync(distDir)
        
        if(nuxt.options.app.baseURL !== '/') {
          let baseUrl = nuxt.options.app.baseURL;
          
          let firstChar = baseUrl.substring(0, 1);
          
          if(firstChar === '/') {
            baseUrl = baseUrl.substring(1);
          }

          let content = readFileSync(indexFilePath, 'utf-8');
          
          let re = new RegExp(`${baseUrl}/?themes/${section}/`,'g');
          content = content.replace(re, `themes/${section}/`);
          writeFileSync(indexFilePath, content);
        }
      }
    }
  }
})
