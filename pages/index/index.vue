<script setup>
import sidebar from "~/data/sidebar.json";
definePageMeta({
  layout: "with-sidebar",
});
const { getSiteinfo } = useSiteinfo();

const drawer = ref(false);
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between d-md-none">
      <v-app-bar-nav-icon class="" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-icon @click="signOutEvent" icon="fas fa-arrow-right-from-bracket" size="large" style="transform: rotate(180deg);"></v-icon>
    </div>
    <v-navigation-drawer v-model="drawer" location="bottom" temporary class="mobileMenu w-100">
      <v-list density="compact" nav class="">
          <v-list-item  :to="item.link" v-for="(item, i) in sidebar.links" :key="i"
            :link="true"
            :href="item.link"
            :prepend-icon="item.icon" 
            :title="item.title"
            :value="item.value"
            color="#00A58F">
          </v-list-item>
        </v-list>
    </v-navigation-drawer>
    <div class="h-screen" style="height: 60dvh !important;display:flex;justify-content:center;align-items:center;">
      <h3 style="text-align: center;">
        {{ getSiteinfo().name }}
        <br />  
        به سامانه ۱۳۷ خوش آمدید
      </h3>
    </div>
  </div>
</template>
