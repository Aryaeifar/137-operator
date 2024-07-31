<script setup>
import sidebar from "~/data/sidebar.json"
const { $flashMsg, $localePath } = useNuxtApp();
const { logOut } = useAuth();
const drawer = ref(false);
const {getBreadcrumbs } = useBreadcrumbs();

function signOut() {
  logOut();
  navigateTo({ path: $localePath("/") });
}
function signOutEvent() {
  $flashMsg.success({
    text: "شما با موفقیت خارج شدید",
  });

  signOut();
}
</script>

<template>
    <CommonTheSidebar :links="sidebar.links">
        <div class="d-flex flex-column justify-space-between mh-100vh">
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
        <v-breadcrumbs class="ps-0" :items="getBreadcrumbs()">
          <template v-slot:title="{ item }">
            {{ item.title.toUpperCase() }}
          </template>
        </v-breadcrumbs>
            <slot/>
            <CommonTheFooter/>
        </div>
    </CommonTheSidebar>
   
</template>
