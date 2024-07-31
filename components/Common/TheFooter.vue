<script setup>
const { t: $t } = useI18n();
const { getSiteinfo } = useSiteinfo();
const siteInfo = ref({
  name: getSiteinfo().name,
});
</script>

<template>
    <!-- <div class="footer mt-8 pt-8 rounded-sm">
       <v-row>
            <v-col cols="12" md="3">
                <div class="d-flex flex-column align-center">
                    <img src="@/assets/images/logo2.svg" alt="" width="100" class="mb-3">
                    <h2 class="text-pri">{{ $t('سامانه 137') }}</h2>
                    <h2 class="text-pri">{{ siteInfo.name }}</h2>
                </div>
            </v-col>
            <v-col cols="12" md="6">
                <div class="contact-us">
                    <h2 class="text-pri mb-3"></h2>
                    <h2 class="text-pri mb-3">{{ $t('') }}</h2>
                    <div class="footer-content d-flex">
                        <div>
                            <img src="@/assets/images/phone.svg" alt="">
                        </div>
                        <div class="ms-3">{{ $t('تلفن') }}: 137</div>
                        
                    </div>
                    <div class="footer-content d-flex">
                        <div>
                            <img src="@/assets/images/mail.svg" alt="">
                        </div>
                        <div class="ms-3">{{ $t('پست الکترونیکی') }}: info@Kiakola137.com</div>
                        
                    </div>
                    <div class="@footer-content d-flex">
                        <div>
                            <img src="@/assets/images/location.svg" alt="">
                        </div>
                        <div class="ms-3">{{ $t('آدرس') }} : ساری،18 دی ، خیام، جنب فروشگاه کوروش</div>
                        
                    </div>
                </div>
            </v-col>
            <v-col cols="12" md="3">
                <div>
                    <h2 class="text-pri mb-3">{{ $t('دسترسی سریع') }}</h2>
                    <div class="footer-content d-flex">
                        <div>
                            <img src="@/assets/images/record.svg" alt="">
                        </div>
                        <div class="ms-3">{{ $t('ثبت گزارش') }}</div>
                    </div>
                    <div class="footer-content d-flex">
                        <div>
                            <img src="@/assets/images/peygiri.svg" alt="">
                        </div>
                        <div class="ms-3">{{ $t('پیگیری گزارش') }}</div>
                    </div>
                    <div class="footer-content d-flex">
                        <div>
                            <img src="@/assets/images/question.svg" alt="">
                        </div>
                        <div class="ms-3"> {{ $t('سوالات متداول') }}</div>
                    </div>
                    <div class="footer-content d-flex">
                        <div>
                            <img src="@/assets/images/phone.svg" alt="">
                        </div>
                        <div class="ms-3"> {{ $t('تماس با ما') }} </div>
                    </div>
                </div>
            </v-col>
       </v-row>
       
    </div> -->
    <h3 class="admin-footer d-flex align-center mt-10 justify-center bg-white pa-3 text-pri mb-3">{{ $t('محصولی از شرکت') }} 
        <a href="https://hemend.com/" class="d-flex align-center">
            <img src="@/assets/images/hemend.svg" alt="" class="ms-3">
        </a>
       </h3>
</template>
<style scoped>
.footer-content {
    font-size:17px ;
}
</style>