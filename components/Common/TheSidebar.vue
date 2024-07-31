<script setup>
import { getSiteUrl } from '@/helpers/utils'
const { $files } = useNuxtApp();
const { t: $t } = useI18n();
const { logOut } = useAuth();
const { $localePath, $flashMsg } = useNuxtApp();
const props = defineProps({
  links:{
    type : Array
  }
})
const { getSiteinfo} =  useSiteinfo()
const siteInfo = ref({
  name:getSiteinfo().name,
  address:getSiteinfo().address,
  email:getSiteinfo().email,
  phone_number:getSiteinfo().phone_number,
  logo:getSiteinfo().logo
})
function signOut() {
  logOut();
  navigateTo({ path: $localePath("/login") });
}
function signOutEvent() {
  $flashMsg.success({
    text: "شما با موفقیت خارج شدید",
  });

  signOut();
}
</script>
<template>
    <div class="mh-100vh">
      <v-card class="mh-100vh">
        <v-layout class="mh-100vh">
            <v-navigation-drawer
              permanent
              location="right"
              class="d-none d-md-block"
            >
              <template v-slot:prepend>
                <div class="pa-4 d-flex align-center">
                  <img :src="$files.orgLogo(siteInfo.logo)" alt="" width="40">
                  <div class="ms-4 d-flex flex-column">
                    {{siteInfo.name}}
                    <nuxt-link to="/" class="text-blue">
                      صفحه اصلی
                    </nuxt-link>
                  </div>
                </div>
              </template>

             

                <v-list density="compact" nav class="">
                  <v-list-item  :to="item.link" v-for="(item, i) in links" :key="i"
                    :link="true"
                    :href="item.link"
                    :prepend-icon="item.icon" 
                    :title="item.title"
                    :value="item.value"
                    color="#00A58F">
                  </v-list-item>
                </v-list>
                <div class="sidebar-buttons">
                  <div class="pa-2 text-pri ">
                  <v-btn :href="getSiteUrl()" target="_blank" block color="sec">
                   نمایش سایت 
                  </v-btn>
                </div>
                <div class="pa-2 text-pri">
                  <v-btn block color="pri" @click="signOutEvent">
                    خروج
                  </v-btn>
                </div>
                </div>
            </v-navigation-drawer>
          
            <v-main class=" text-start mh-100vh">
                <div class="p-5 px-lg-10 mh-100vh">
                  <slot/>
                </div>
            </v-main>
        </v-layout>
      </v-card>
    </div>
</template>
<style scoped>
.v-card--variant-elevated {
  background: transparent !important;
}
.v-main {
  height: 100%;
}
</style>