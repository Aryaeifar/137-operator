<script  setup>
const { $flashMsg } = useNuxtApp();
const { t: $t } = useI18n();
const props = defineProps({
    value: {
     type: Boolean,
    },
    isTrackingCode:{
        type:Boolean,
        default:false
    },
    trackingCode:{
        type:String
    }
});
function copyText() {
  navigator.clipboard.writeText(props.trackingCode)
    .then(() => {
        $flashMsg.success({
            text: 'کد رهگیری با موفقیت کپی شد',
        });
    })
    .catch(err => {
      console.log('Failed to copy text: ', err)
    })
}
</script>

<template>
  <v-dialog class="custom-modal" :value="value" @input="$emit('update:modelValue', $event)"  width="auto">
    <v-card class="py-3 px-16" style="width: 40rem;">
     
       <div class="d-flex flex-column align-center mb-10">
        <div class="bg-white rounded-circle pa-3 mb-3">
            <v-icon color="pri" icon="fas fa-exclamation"></v-icon>
        </div>
        <p class="mb-3">
            برای پیگیری گزارش، کد رهگیری زیر استفاده کنید. <span class="text-pri" @click="copyText" role="button">کد رهگیری را کپی کنید</span>
        </p>
        <div class="d-flex align-center" v-if="isTrackingCode">
            <p>{{ $t('کد رهگیری شما') }}: &nbsp;</p>
            <h3 class="text-pri me-3" id="code">{{ trackingCode }}</h3>
            <i class="fa-solid fa-copy text-sec mb-1" role="button"  @click="copyText"></i>
        </div>
        <v-card-text v-else>
            <slot/>
        </v-card-text>
       </div>

        <v-btn color="pri" block @click="$emit('update:modelValue', false)" >{{ $t('متوجه شدم') }}</v-btn>
    </v-card>
  </v-dialog>
  
</template>
