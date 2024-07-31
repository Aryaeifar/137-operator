
<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="rgb(245, 125, 129, var(--color-opacity))" :height="5" />
    <NuxtPage />
  </NuxtLayout>
  <Teleport to="body">
    <FlashMessage position="left bottom" />
  </Teleport>
</template>
<style>
.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>