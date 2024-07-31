<script setup>
import useVuelidate from "@vuelidate/core";
import { numeric, required, minLength, maxLength, helpers } from "@vuelidate/validators";
import {restrictToNumber} from '@/helpers/utils'

definePageMeta({
  layout: "full-page",
  middleware: ["guest"],
});
const { t: $t } = useI18n();
const { $request, $flashMsg } = useNuxtApp();
const hashCode = ref(null);
const token = ref(null);
const user = ref(null);
const isMobile = ref(false);
const isLoading = ref(false);
const state = ref({
  phoneNumber: "",
  password: "",
  passCode: "",
});

const rules = ref({
  phoneNumber: {
    required: helpers.withMessage($t("لطفا شماره موبایل خود را وارد کنید"), required),
    minLength: helpers.withMessage($t("شماره موبایل باید حداقل 11 رقم باشد"), minLength(11)),
    maxLength: helpers.withMessage($t("شماره موبایل باید حداکثر 11 رقم باشد"), maxLength(11)),
  },
  passCode: {
    required: helpers.withMessage($t("کد یکبار مصرف 4 رقمی را وارد کنید"), required),
    maxLength: helpers.withMessage($t("کد یکبار مصرف باید حداکثر 4 رقم باشد"), maxLength(4)),
    minLength: helpers.withMessage($t("کد یکبار مصرف باید حداقل 4 رقم باشد"), minLength(4)),
    numeric: helpers.withMessage($t("لطفا عدد وارد کنید"), numeric),
  },
});
const v$ = useVuelidate(rules, state);
const sendCode = () => {
  v$.value.phoneNumber.$validate();
  if (v$.value.phoneNumber.$error) {
    $flashMsg.error({
      text: $t("لطفا یک شماره تماس معتبر وارد کنید."),
    });
  } else {
    isLoading.value = true;
    $request
      .post("auth.sendCode", {
        body: {
          mobile: state.value.phoneNumber,
        },
      })
      .then(({ data, error }) => {
        if (!error) {
          hashCode.value = data.hash;
          isLoading.value = false;
          isMobile.value = true;
          $flashMsg.success({
            text: $t("یک کد تایید 4 رقمی برای شما ارسال شد"),
          });
        } else if (error.status_code == "WAITING_TO_SEND_AGAIN") {
          isLoading.value = false;
          $flashMsg.error({
            text: $t("حداقل 2 دقیقه برای کد ورود جدید طول میکشد."),
          });
        }
      });
  }
};

const login = () => {
  v$.value.passCode.$validate();
  const errorMsg = {
  AUTH_INFO_INCORRECT:"کد وارد شده نامعتبر میباشد",
  CODE_EXPIRED:"کد وارد شده منقضی شده است",
  MOBILE_NUMBER_UNOCCUPIED:"کد وارد شده صحیح میباشد ولی هیچ کاربری با این شماره وجود ندارد",
}
  if (v$.value.passCode.$error) {
    $flashMsg.error({
      text: $t("کد وارد شده نامعتبر میباشد"),
    });
  } else {
    isLoading.value = true;
    $request
      .post("auth.signIn", {
        body: {
          hash: hashCode.value,
          mobile: state.value.phoneNumber,
          code: state.value.passCode,
        },
      })
      .then(({ data, error }) => {
        isLoading.value = false;
        if (!error) {
          token.value = data.token;
          user.value = data.user;
          useAuth().setToken(token.value);
          useUser().setUser(user.value);
          navigateTo("/submit-report");
          $flashMsg.success({
            text: $t("شما با موفقیت وارد شدید"),
          });
        } else if (error.status_code) {
          isMobile.value = true;
          $flashMsg.error({
            text: errorMsg[error.status_code],
          });
        }
      });
  }
};

const handlePhone = () => {
  state.value.phoneNumber  = restrictToNumber(state.value.phoneNumber)
};
const handlePass = () => {
  state.value.passCode  = restrictToNumber(state.value.passCode)
};
</script>
<template>
  <div class="h-100">
    <v-row class="h-screen">
      <v-col cols="12" md="5">
        <div class="h-100 bg-white rounded-lg">
          <div class="d-flex flex-column align-center justify-center h-100 px-6 px-md-16">
            <div class="mb-6 w-100">
              <h1 class="mb-3">{{ $t("خوش برگشتی") }} 👏</h1>
              <p>{{ $t("برای شروع، شماره موبایل خود را وارد کنید") }}</p>
            </div>
            <v-form class="w-100" @submit.prevent>
              <v-text-field
                :label="$t('کد 4 رقمی ارسال شده')"
                v-model="state.passCode"
                :error-messages="v$.passCode.$errors.map((e) => e.$message)"
                hide-details="auto"
                class="mb-3 bg-white rounded-lg form_input"
                @keyup.enter="login"
                maxlength="4"
                inputmode="numeric"
                @input="handlePass"
                v-if="isMobile"></v-text-field>
              <v-text-field
                :label="$t('شماره همراه ')"
                v-model="state.phoneNumber"
                :error-messages="v$.phoneNumber.$errors.map((e) => e.$message)"
                hide-details="auto"
                class="mb-3 bg-white rounded-lg form_input"
                @keyup.enter="sendCode"
                maxlength="11"
                inputmode="numeric"
                @input="handlePhone"
                v-else></v-text-field>
              <v-btn
                class="bg-sec text-white"
                variant="flat"
                block
                :loading="isLoading"
                @click="login"
                :disabled="false"
                v-if="isMobile">
                {{ $t("ورود") }}
              </v-btn>
              <v-btn
                class="bg-sec text-white"
                variant="flat"
                block
                :loading="isLoading"
                @click="sendCode"
                :disabled="false"
                v-else>
                {{ $t(" ارسال کد") }}
              </v-btn>
            </v-form>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="7" class="d-none d-sm-block">
        <div class="d-flex justify-center align-center h-100 rounded-lg">
          <img src="@/assets/images/login-bg.png" alt="" class="w-75" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>
