<script setup>
import useVuelidate from "@vuelidate/core";
import { required, helpers, maxLength } from "@vuelidate/validators";
import { formatTime, formatDate } from "@/helpers/utils";
const { getUser } = useUser();
const { $request, $flashMsg } = useNuxtApp();
const route = useRoute();
const { t: $t } = useI18n();
const report = ref([]);
const statusList = ref({});
const isLoading = ref(false);
const dialog = ref(false);3
const status = computed(() => {
  return statusList.value[report.value?.status] ?? "نامشخص";
});
const state = ref({
  answer: "",
});
const rules = ref({
  answer: {
    required: helpers.withMessage($t("لطفا جواب گزارش  را پر کنید"), required),
    maxLength: helpers.withMessage($t("حداکثر 1000 کاراکتر میتوانید ثبت کنید"), maxLength(1000)),
  },
});
const v$ = useVuelidate(rules, state);
const problemType = {
  Suggest: $t("پیشنهاد"),
  Problem: $t("مشکل"),
};
const { data, error } = await $request.post(`report.getById`, {
  body: {
    id: route.params.report_id,
  },
});
if (!error) {
  report.value = data.result;
}
const { data: statusGet, error: statusErr } = await $request.post("report.getStatus");
if (!statusErr) {
  statusList.value = statusGet.report_status;
} else if (statusErr) {
  $flashMsg.error({
    text: $t("مشکل در دریافت لیست وضعیت"),
  });
}
const sendAdminAnswer = () => {
  v$.value.$validate()
    .then((isValid) => {
      if (isValid) {
        isLoading.value = true;
        $request.post("report.addAnswer", {
            body: {
              org_report_id: report.value.id,
              answer: state.value.answer,
            },
          })
          .then(({ data, error }) => {
            if (!error) {
              isLoading.value = false;
              v$.value.$reset();
              $flashMsg.success({
                text: $t("جواب شما ارسال شد"),
              });
              report.value.answers.push({
                answer: state.value.answer,
                answer_by_id: getUser().id,
                admin: {
                  firstname: getUser().firstname,
                  lastname: getUser().lastname,
                },
                time:data.answer.created_at
              });
              state.value.answer = null;
            } else if (error.status_code == "ANSWER_INVALID") {
              isLoading.value = false;
              $flashMsg.error({
                text: $t("فیلد پاسخ به گزارش باید پر شود"),
              });
            } else if (error.status_code == "REPORT_ID_INVALID") {
              isLoading.value = false;
              $flashMsg.error({
                text: $t("فیلد پاسخ به گزارش باید پر شود"),
              });
            }
          });
      }
    })
    .catch((err) => {
      isLoading.value = false;
    });
};
</script>

<template>
  <div class="overflow-auto border rounded">
    <div class="rounded h-100 pa-4">
      <h2 class="text-center">
        کد رهگیری: <span class="text-sec"> {{report.code}}</span>
      </h2>
      <h3 class="fw-light mb-5">
        {{ report.title }}
        <span class="base-border rounded-pill px-6 text-aux">{{ problemType[report.type] }}</span>
      </h3>
      <div class="text-pri mb-3">
        <v-icon color="pri" icon="fas fa-location-dot"></v-icon>
        {{ report.address }}
      </div>
      <div class="d-flex flex-column flex-md-row align-start  align-md-center justify-space-between mb-5">
        <div class="mb-3 mb-md-0" v-if="report.admin">
          {{ $t("ارجاع شده به") }}
          <span class="text-comm">{{ report?.admin?.firstname }} {{ report?.admin?.lastname }}</span>
        </div>
        <div>
          <v-btn color="pri" variant="flat" @click="dialog = true"> انتخاب وضعیت </v-btn>&nbsp; : {{ status }}
          <ModalBaseStatusModal v-model="dialog" :report="report" :status="statusList" v-model:status="report.status" />
        </div>
      </div>
      <div class="bg-neu rounded pa-3 mb-3 ">
        <p class="" style="font-size: 14px; font-family: 'iransansNum-regular'">{{ report.desc }}</p>
        <small class="d-flex align-center justify-end">
          ارسال شده در
          {{ formatDate(report.created_at) }}
          ساعت
          {{formatTime(report.created_at )}}
        </small>
      </div>

      <div class="bg-sec-l rounded pa-3 mb-3" v-for="answer in report.answers" :key="answer.answer_by_id">
        <p>{{ answer.answer }}</p>

        <div class="d-flex align-center justify-end">
          <small>
            پاسخ داده شده توسط
            <span class="text-comm me-2">{{ answer.admin.firstname }} {{ answer.admin.lastname }}</span></small
          >
          <small>
            در ساعت 
            {{ answer.created_at ? formatTime(answer.created_at) : '' }}
            {{ answer.time ?  formatTime(answer.time) : ''  }}
          </small>
        </div>
      </div>
    </div>
    <div class="rounded h-100 pa-4">
      <h3 class="mb-3 d-flex align-center">
        <v-icon class="me-3" color="pri" icon="fas fa-user-tie"></v-icon>
        {{ $t("پاسخ به گزارش") }}
      </h3>
      <v-textarea
        class="base-select-box form_input"
        :label="$t('پاسخ ')"
        v-model="state.answer"
        hide-details="auto"
        bg-color="neu"
        :error-messages="v$.answer.$errors.map((e) => e.$message)"
        maxlength="1000">
      </v-textarea>
      <v-btn color="pri" variant="flat" class="mt-3" :loading="isLoading" @click="sendAdminAnswer">
        {{ $t("ارسال") }}
      </v-btn>
    </div>
  </div>
</template>
