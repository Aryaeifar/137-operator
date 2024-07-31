<script lang="ts" setup>
const props = defineProps({
    title:{
        type: String
    },
    icon:{
        type: String
    },
    link:{
        type: String
    }
    
})
</script>

<template>
    <nuxt-link :to="link">
        <div class="record-button d-flex flex-column align-center bg-white rounded-lg pa-16 mx-16">
            <img :src="icon" class="mb-3" alt="">
            {{ title }}
         </div>
    </nuxt-link>
</template>
<style scoped>
.record-button {
    background-image: url('@/assets/images/RecordButtonBg.svg');
    background-position: center;
    background-size: cover;
    width: 19rem;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
    font-size: 20px;
    font-weight: 700;
}
</style>